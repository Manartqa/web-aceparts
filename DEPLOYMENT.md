# Deployment

The site runs as a **Docker container behind nginx** on a Linux VM. The image is
built on a Windows workstation with `scripts/deploy.ps1`, copied to the VM as a
tarball, loaded, and started with `docker run`.

```
internet ──▶ nginx :80/:443 ──▶ 127.0.0.1:3000 ──▶ container: node server.js
             TLS (Let's Encrypt)                    restart: unless-stopped
             :80 → 301 to https
```

Placeholders used below: `<user>@<vm-host>` for the SSH login, `~/aceparts-web.env`
for the runtime env file. Fill in the real values once the VM exists.

---

## Build-time vs runtime

The most common way to misconfigure this app.

| Variable | Where it is set | Changing it needs |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_NOINDEX` | `deploy.ps1 -SiteUrl` / `-Staging` → `docker build --build-arg` | **A rebuild.** Baked into canonical tags, `sitemap.xml` and `robots.txt` by `next build`. Putting them in the env file does nothing. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `MAIL_SENDER`, `CONTACT_MAIL_TO` | `~/aceparts-web.env` → `docker run --env-file` | **A new container** ([step 5](#5-swap-the-container)). `docker restart` does not re-read the file. |

---

## First-time VM setup

Needs Docker, nginx and certbot on the VM, and DNS for `aceparts.co.th` and
`www.aceparts.co.th` pointing at it.

### Runtime env file

```bash
install -m 600 /dev/null ~/aceparts-web.env && nano ~/aceparts-web.env
```

Contents (see `.env.example`):

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...@....iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
MAIL_SENDER=admin@acethailand.co.th
CONTACT_MAIL_TO=operations@acethailand.co.th
```

`--env-file` takes each line as is: no quotes around the key, and keep its `\n`
escapes on one line; the app turns them back into line breaks.

The service account needs **domain-wide delegation** in the Google Workspace Admin
console (Security → API controls) for `https://www.googleapis.com/auth/gmail.send`
only. That lets it send as *any* user in the domain, so treat the key like a
password; to cut it off, delete the key or the delegation entry.

### nginx site

`/etc/nginx/sites-available/aceparts-web`, symlinked into `sites-enabled`. This is
the HTTP-only config for the first start; [TLS](#tls) replaces it:

```nginx
server {
    listen 80;
    server_name aceparts.co.th www.aceparts.co.th;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # Overwrite, never append. See below.
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

**Why overwrite `X-Forwarded-For`:** the contact form's rate limit
(`src/app/contact-us/actions.ts`) keys on the left-most `X-Forwarded-For` entry.
The usual `$proxy_add_x_forwarded_for` appends to whatever the visitor sent, so a
spammer could send a fresh fake address on every request and never be limited.

### TLS

Only possible once DNS resolves to the VM:

```bash
sudo certbot --nginx -d aceparts.co.th -d www.aceparts.co.th --redirect
```

Then replace the site file with the final config below and reload nginx. It does
three things the certbot edit does not:
- **One canonical host.** The canonical host is `https://aceparts.co.th` (no
  `www`), as on the WordPress site. Every other address reaches it in one 301:
  `http://`, `http://www.` and `https://www.`.
- **Security headers.** Next.js sends none.
- **HTTP/2.**

```nginx
# HTTP: straight to the canonical host. certbot answers its renewal challenge
# here by itself.
server {
    listen 80;
    server_name aceparts.co.th www.aceparts.co.th;
    return 301 https://aceparts.co.th$request_uri;
}

# www over HTTPS: same, in one hop.
server {
    listen 443 ssl http2;
    server_name www.aceparts.co.th;
    ssl_certificate /etc/letsencrypt/live/aceparts.co.th/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aceparts.co.th/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    return 301 https://aceparts.co.th$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aceparts.co.th;
    ssl_certificate /etc/letsencrypt/live/aceparts.co.th/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aceparts.co.th/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Short HSTS until the switch is verified, then raise it (go-live checklist).
    add_header Strict-Transport-Security "max-age=300" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # Overwrite, never append. See "nginx site" above.
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

The app already gzips its responses, so nginx does not compress them again. There
is no Content-Security-Policy yet. Next.js inline scripts would need nonces, so a
CSP needs testing of its own before it goes in.

Renewal is automatic; check it with `sudo certbot renew --dry-run`.

---

## Deploying a change

### 1. Build on Windows

Docker Desktop must be running. From the repository root, on the commit to ship:

```powershell
.\scripts\deploy.ps1
```

Runs lint and the Playwright suite, builds the image for
`https://aceparts.co.th`, and writes `aceparts-web.tar` (ignored by git). For a
staging address, which must not be indexed:

```powershell
.\scripts\deploy.ps1 -SiteUrl https://staging.aceparts.co.th -Staging
```

### 2. Upload

```powershell
scp .\aceparts-web.tar <user>@<vm-host>:~/
```

### 3. Load the image

Tag the running image first so there is something to roll back to:

```bash
sudo docker tag aceparts-web:latest aceparts-web:previous
```

```bash
sudo docker load -i ~/aceparts-web.tar && rm ~/aceparts-web.tar
```

### 4. Check the runtime env

Lists variables that differ between the env file and the running container
(names only). `PATH`, `NODE_*`, `PORT`, `HOSTNAME`, `NEXT_TELEMETRY_DISABLED`
always appear indented; the image sets them.

```bash
comm -3 <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' ~/aceparts-web.env | sort) <(sudo docker inspect aceparts-web --format '{{range .Config.Env}}{{println .}}{{end}}' | grep -v '^$' | sort) | sed -E 's/=.*//'
```

### 5. Swap the container

The site returns 502 for 5–10 seconds.

```bash
sudo docker rm aceparts-web-old 2>/dev/null || true
```

```bash
sudo docker rename aceparts-web aceparts-web-old && sudo docker stop aceparts-web-old
```

```bash
sudo docker run -d --name aceparts-web --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file ~/aceparts-web.env --log-opt max-size=10m --log-opt max-file=5 aceparts-web:latest
```

The port is published on `127.0.0.1` only, so the container is reachable through
nginx alone. After about 30 seconds `sudo docker ps` should show it `(healthy)`.

### 6. Verify

```bash
curl -sI https://aceparts.co.th/ | head -1
```

```bash
curl -s https://aceparts.co.th/robots.txt
```

Production must show `Allow: /` and a `Sitemap:` line. `Disallow: /` means a
staging build went to production: rebuild without `-Staging`.

```bash
curl -s https://aceparts.co.th/sitemap.xml | grep -m2 '<loc>'
```

Every `<loc>` must start with `https://aceparts.co.th`.

```bash
curl -sI https://aceparts.co.th/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy|x-powered-by'
```

Four security headers, and no `X-Powered-By`.

```bash
for u in http://aceparts.co.th/about-us/ http://www.aceparts.co.th/about-us/ https://www.aceparts.co.th/about-us/ https://aceparts.co.th/about-us https://aceparts.co.th/portfolio/ https://aceparts.co.th/wp-sitemap.xml; do printf '%s -> ' "$u"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$u"; done
```

Each one is a single redirect:
- **the three non-canonical hosts** → `301` to `https://aceparts.co.th/about-us/`
- **`/about-us`** → `308` to `/about-us/`
- **`/portfolio/`** → `308` to `/products/`
- **`/wp-sitemap.xml`** → `308` to `/sitemap.xml`

Mail settings are only used when a message is sent, so send one real enquiry
through `/contact-us/` and confirm it arrives. A missing variable is named in `sudo docker logs aceparts-web`.

### 7. Clean up

After a day or two without problems:

```bash
sudo docker rm aceparts-web-old && sudo docker rmi aceparts-web:previous
```

## Rollback

While `aceparts-web-old` exists:

```bash
sudo docker rm -f aceparts-web && sudo docker rename aceparts-web-old aceparts-web && sudo docker start aceparts-web
```

If only the `:previous` tag remains:

```bash
sudo docker rm -f aceparts-web && sudo docker run -d --name aceparts-web --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file ~/aceparts-web.env --log-opt max-size=10m --log-opt max-file=5 aceparts-web:previous
```

## Operating

```bash
sudo docker ps
sudo docker logs -f --tail=100 aceparts-web
sudo docker image prune -f
sudo nginx -t && sudo systemctl reload nginx
sudo certbot certificates
```

---

## Go-live checklist (moving from WordPress)

Before the switch:

- [ ] Deploy a **staging** build (`-Staging`) and have A.C.E. review every page.
- [ ] Resolve the `NEEDS REVIEW` items in `src/content/pages.ts` (About statistics,
      the SRT founding year) with A.C.E.
- [ ] Point `CONTACT_MAIL_TO` at A.C.E.'s own mailbox, and send a test
      enquiry from staging.
- [ ] Take a full backup of the WordPress site (files and database). Keep it for at
      least 30 days after the switch.
- [ ] Lower the DNS TTL for `aceparts.co.th` and `www` to 300 seconds a day ahead.

Switch:

- [ ] Build and deploy production (`.\scripts\deploy.ps1`, no `-Staging`).
- [ ] Point DNS at the VM, then run certbot ([TLS](#tls)).
- [ ] Run the checks in [step 6](#6-verify), plus a few old URLs, e.g.
      `curl -sI https://aceparts.co.th/hello-world/` → `308` to `/`.

After:

- [ ] Google Search Console: verify the domain (DNS TXT record), remove the old
      `wp-sitemap.xml`, submit `https://aceparts.co.th/sitemap.xml`, watch Pages →
      "Not found (404)" for a few weeks.
- [ ] Bing Webmaster Tools: import the site from Search Console and submit the
      sitemap (Bing also feeds ChatGPT search and Copilot).
- [ ] Rich Results Test on `/` and one `/our-services/<slug>/` page: Organization,
      WebSite, Service and BreadcrumbList with no errors.
- [ ] After a week without HTTPS problems, raise HSTS in the nginx config to
      `max-age=31536000` ([TLS](#tls)).
- [ ] Restore the DNS TTL.
- [ ] Shut down the WordPress hosting once the backup period ends.

## Known gaps

- **Rate limiting is per container, in memory.** It resets on restart and would
  multiply with replicas. Fine for one container.
- **Old image URLs** (`/wp-content/uploads/...`) are not redirected; they 404.
  Only matters if they are linked from elsewhere or rank in Google Images.
- **An unknown product or service slug returns 200**, not 404 (streamed shell
  with Cache Components). The page is the 404 page with `noindex`, so it is not
  indexed. Unknown top-level paths return a real 404.
