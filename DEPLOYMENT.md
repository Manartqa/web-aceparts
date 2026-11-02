# Deployment

The site runs as a **Docker container on the on-premise server `websmart`**, next
to `smartalliance-web`, behind FortiGate and the company's central nginx host.
Same layout as the Smart Alliance site (its `DEPLOYMENT-ONPREM.md`); only the
names and the host port differ.

```
internet ──▶ FortiGate ──────────────▶ central nginx ─────────────▶ websmart 172.22.22.201:3001
             public IP                  TLS (certificate here)        container web-aceparts
             NAT 80/443, no TLS         :80 → 301 https               node server.js (:3000 inside)
                                        host-based routing
```

| | |
|---|---|
| App server | `websmart` — Ubuntu, `172.22.22.201`, SSH `smart` |
| Deploy path | `/opt/docker/web-aceparts` (`compose.yaml` + `.env.production`) |
| Container | `web-aceparts`, published on `172.22.22.201:3001` → `3000` inside |
| Neighbour | `smartalliance-web` on `172.22.22.201:3000` — not touched by anything here |
| Central nginx | `172.22.22.170` — TLS, port 80 redirect, routing by host name. Site file: [scripts/nginx/aceparts.conf](scripts/nginx/aceparts.conf) |
| FortiGate | Public IP; forwards 80 and 443 to the central nginx |
| Canonical host | `https://aceparts.co.th` (no `www`), as on the WordPress site |

The image is built on a Windows workstation with `scripts/deploy.ps1`, copied to
the server as a tarball and started with Docker Compose. The server holds no
source code and builds nothing.

---

## Build-time vs runtime

The most common way to misconfigure this app.

| Variable | Where it is set | Changing it needs |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_NOINDEX` | `deploy.ps1 -SiteUrl` / `-Staging` → `docker build --build-arg` | **A rebuild.** Baked into canonical tags, `sitemap.xml` and `robots.txt` by `next build`. Putting them in `.env.production` does nothing. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `MAIL_SENDER`, `CONTACT_MAIL_TO` | `/opt/docker/web-aceparts/.env.production` → `env_file:` in `compose.yaml` | **A new container**: `sudo docker compose up -d --force-recreate`. `restart` does not re-read the file. |

---

## Proxy chain

The app needs only what the Smart Alliance site gets: `Host` unchanged and
`X-Forwarded-For` **overwritten** with the visitor's address. The contact form's
rate limit (`src/app/contact-us/actions.ts`) keys on the left-most
`X-Forwarded-For` entry; `$proxy_add_x_forwarded_for` appends to whatever the
visitor sent, so a spammer could pick a fresh address on every request.

### FortiGate

The VIP for 80/443 → `172.22.22.170` already exists for the Smart Alliance site;
nginx routes by host name, so nothing new is needed for aceparts beyond:

- **No source NAT** on the inbound policy, as for Smart Alliance. With SNAT every
  visitor arrives as FortiGate's inside address and shares one contact-form budget
  (5 per 10 min).
- Outbound from `172.22.22.201`: 443 to `oauth2.googleapis.com` and
  `gmail.googleapis.com` (the contact form), and DNS. A blocked call does not
  break the site — it fails the form only, and the container log names the call.
- From `172.22.22.170` to `172.22.22.201:3001`, if the two are in different
  segments.

### Central nginx

[scripts/nginx/aceparts.conf](scripts/nginx/aceparts.conf):

| | |
|---|---|
| :80 | `/.well-known/acme-challenge/` from `/var/www/letsencrypt`, everything else `301` to `https://aceparts.co.th` |
| :443 `www.aceparts.co.th` | `301` to `https://aceparts.co.th`, in one hop |
| :443 `aceparts.co.th` | `proxy_pass http://172.22.22.201:3001`, plus security headers (Next.js sends none) and a short HSTS |
| `Host` | `$host` — unchanged |
| `X-Forwarded-For` | `$remote_addr` — overwritten |
| `proxy_buffering` | off (Next streams HTML) |

nginx 1.25.1 and later warn that `listen … http2` is deprecated. It still works;
`http2 on;` is the newer spelling if the host's other sites use it.

The app already gzips its responses, so nginx does not compress them again. There
is no Content-Security-Policy yet: Next.js inline scripts would need nonces, so a
CSP needs testing of its own.

### Certificate

On the central nginx host, covering **`aceparts.co.th` and
`www.aceparts.co.th`**. The site file points at Let's Encrypt paths; change the
`ssl_certificate*` lines if a purchased certificate is used.

HTTP-01 cannot issue until DNS points at FortiGate. To test end to end before the
switch, use a purchased certificate or a DNS-01 challenge (a TXT record, so it
needs DNS access):

```bash
sudo certbot certonly --manual --preferred-challenges dns -d aceparts.co.th -d www.aceparts.co.th
```

Manual DNS-01 does not renew itself. After the switch, re-issue once over HTTP-01
so the timer renews it:

```bash
sudo certbot certonly --webroot -w /var/www/letsencrypt -d aceparts.co.th -d www.aceparts.co.th --force-renewal
```

---

## First-time setup

### App server (`websmart`)

As `smart`. Drop `sudo` from `docker` commands if `smart` is in the `docker` group.

```bash
sudo install -d -o smart -g smart -m 750 /opt/docker/web-aceparts
```

Port 3001 is free (3000 belongs to `smartalliance-web`):

```bash
sudo ss -ltnp | grep ':3001 ' || echo free
```

Google is reachable — each should print an HTTP status, not time out:

```bash
for u in https://oauth2.googleapis.com/token https://gmail.googleapis.com/; do curl -s -o /dev/null -m 10 -w "%{http_code} $u\n" "$u"; done
```

### Runtime env file

```bash
install -m 600 /dev/null /opt/docker/web-aceparts/.env.production && nano /opt/docker/web-aceparts/.env.production
```

Contents (see `.env.example`). The same lines as a working `.env.local` can be
copied in as they are:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...@....iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
MAIL_SENDER=admin@acethailand.co.th
CONTACT_MAIL_TO=operations@acethailand.co.th
```

Keep the key on one line. Compose turns its `\n` escapes into line breaks inside
double quotes; without quotes the app does it instead. Either works.

Names only, values never printed:

```bash
sed -nE 's/^([A-Za-z_][A-Za-z0-9_]*)=.*/\1/p' /opt/docker/web-aceparts/.env.production | sort
```

The service account needs **domain-wide delegation** in the Google Workspace Admin
console (Security → API controls) for `https://www.googleapis.com/auth/gmail.send`
only. That lets it send as *any* user in the domain, so treat the key like a
password; to cut it off, delete the key or the delegation entry. Never commit the
file, paste it into chat or open it on a shared screen.

### Central nginx host

Nothing on this host may be reloaded with a config that fails `nginx -t` — other
sites share it. The certificate ([Certificate](#certificate)) must exist first;
`nginx -t` fails on a missing certificate file.

From the workstation:

```powershell
scp .\scripts\nginx\aceparts.conf <user>@172.22.22.170:/tmp/
```

On the nginx host (`sites-available` layout; for `conf.d`, move it to
`/etc/nginx/conf.d/` and skip the symlink). Check first that no `aceparts` site
exists already:

```bash
ls /etc/nginx/sites-available /etc/nginx/conf.d 2>/dev/null
```

```bash
sudo install -d -m 755 /var/www/letsencrypt
```

```bash
sudo mv /tmp/aceparts.conf /etc/nginx/sites-available/aceparts.conf && sudo ln -s /etc/nginx/sites-available/aceparts.conf /etc/nginx/sites-enabled/
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`reload`, not `restart`: the other sites keep serving. If `nginx -t` fails,
nothing was applied — remove the symlink and fix the file.

---

## Deploying a change

### 1. Build on Windows

Docker Desktop must be running. From the repository root, on the commit to ship:

```powershell
.\scripts\deploy.ps1
```

Runs lint and the Playwright suite, builds the image for
`https://aceparts.co.th`, and writes `web-aceparts.tar` (about 105 MB, ignored by
git). For a staging address, which must not be indexed:

```powershell
.\scripts\deploy.ps1 -SiteUrl https://staging.aceparts.co.th -Staging
```

### 2. Upload

```powershell
scp .\web-aceparts.tar .\compose.yaml smart@172.22.22.201:/opt/docker/web-aceparts/
```

`compose.yaml` only needs copying the first time and when it changes.

### 3. Load and start (on `websmart`)

```bash
cd /opt/docker/web-aceparts
```

Tag the running image first so there is something to roll back to (skip on the
first deploy):

```bash
sudo docker tag web-aceparts:latest web-aceparts:previous
```

```bash
sudo docker load -i web-aceparts.tar && rm web-aceparts.tar
```

Should print `Loaded image: web-aceparts:latest`.

```bash
sudo docker compose config --quiet && sudo docker compose up -d --force-recreate
```

The site returns 502 for 5–10 seconds while the container starts. After about 30
seconds:

```bash
sudo docker compose ps
```

`web-aceparts` should be `Up … (healthy)`, ports `172.22.22.201:3001->3000/tcp`.

### 4. Verify

On `websmart`, before DNS or nginx are involved:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -H 'Host: aceparts.co.th' http://172.22.22.201:3001/
```

`200`.

```bash
curl -s -H 'Host: aceparts.co.th' http://172.22.22.201:3001/robots.txt
```

Production must show `Allow: /` and a `Sitemap:` line. `Disallow: /` means a
staging build went to production: rebuild without `-Staging`.

```bash
curl -s -H 'Host: aceparts.co.th' http://172.22.22.201:3001/sitemap.xml | grep -m2 '<loc>'
```

Every `<loc>` must start with `https://aceparts.co.th`.

```bash
sudo docker compose logs --tail=50
```

No errors; `Ready in …` near the top.

Through FortiGate and nginx, from a machine **outside** the office network. Before
the DNS switch, pin the names to the FortiGate public IP for one command:

```bash
for u in http://aceparts.co.th/about-us/ http://www.aceparts.co.th/about-us/ https://www.aceparts.co.th/about-us/ https://aceparts.co.th/about-us https://aceparts.co.th/portfolio/ https://aceparts.co.th/wp-sitemap.xml; do printf '%s -> ' "$u"; curl -s -o /dev/null --resolve aceparts.co.th:80:<public-ip> --resolve aceparts.co.th:443:<public-ip> --resolve www.aceparts.co.th:80:<public-ip> --resolve www.aceparts.co.th:443:<public-ip> -w '%{http_code} %{redirect_url}\n' "$u"; done
```

Each one is a single redirect:
- **the three non-canonical hosts** → `301` to `https://aceparts.co.th/about-us/`
- **`/about-us`** → `308` to `/about-us/`
- **`/portfolio/`** → `308` to `/products/`
- **`/wp-sitemap.xml`** → `308` to `/sitemap.xml`

```bash
curl -sI --resolve aceparts.co.th:443:<public-ip> https://aceparts.co.th/ | grep -iE '^HTTP|strict-transport|x-content-type|x-frame|referrer-policy|x-powered-by'
```

`200`, four security headers, no `X-Powered-By`, and a certificate curl accepts
(no `-k`). After the DNS switch, repeat without `--resolve`.

Mail settings are only used when a message is sent, so send one real enquiry
through `/contact-us/` and confirm it arrives. A missing variable is named in
`sudo docker compose logs`.

Then check that nginx sees real visitor addresses: note your public IP on the
outside machine (`curl -s https://ifconfig.me`), make a request, and on the nginx
host `sudo tail -n 5 /var/log/nginx/access.log`. The first field must be your
public IP. A private address means FortiGate source-NATs; see
[FortiGate](#fortigate).

### 5. Clean up

After a day or two without problems:

```bash
sudo docker rmi web-aceparts:previous && sudo docker image prune -f
```

## Rollback

A release, while the `:previous` tag exists:

```bash
cd /opt/docker/web-aceparts && sudo docker tag web-aceparts:previous web-aceparts:latest && sudo docker compose up -d --force-recreate
```

The whole site back to WordPress: point DNS back at the WordPress host (see the
go-live checklist), then take this path out of service so nothing serves from two
places. On the nginx host:

```bash
sudo rm /etc/nginx/sites-enabled/aceparts.conf && sudo nginx -t && sudo systemctl reload nginx
```

On `websmart`:

```bash
cd /opt/docker/web-aceparts && sudo docker compose stop
```

## Operating

On `websmart`, from `/opt/docker/web-aceparts`:

| | |
|---|---|
| Status | `sudo docker compose ps` |
| Logs | `sudo docker compose logs -f --tail=100` |
| Restart (same container, same env) | `sudo docker compose restart` |
| Apply an `.env.production` change | `sudo docker compose up -d --force-recreate` |
| Stop / start | `sudo docker compose stop` / `sudo docker compose start` |
| Health detail | `sudo docker inspect web-aceparts --format '{{json .State.Health}}'` |
| Resource use | `sudo docker stats --no-stream web-aceparts` |
| Clean old images | `sudo docker image prune -f` |

On the central nginx host:

| | |
|---|---|
| Test and apply a config change | `sudo nginx -t && sudo systemctl reload nginx` |
| Access / error log | `sudo tail -f /var/log/nginx/access.log` / `error.log` |
| Certificate expiry | `sudo certbot certificates` |
| Renewal dry run | `sudo certbot renew --dry-run` |

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
- [ ] Note where DNS for `aceparts.co.th` and `www` points today (for rollback),
      then lower the TTL to 300 seconds a day ahead.

Switch:

- [ ] Build and deploy production (`.\scripts\deploy.ps1`, no `-Staging`).
- [ ] Certificate in place and the nginx site enabled ([First-time setup](#first-time-setup)).
- [ ] Point `aceparts.co.th` and `www.aceparts.co.th` at the FortiGate public IP.
- [ ] Run the checks in [step 4](#4-verify) without `--resolve`, plus a few old
      URLs, e.g. `curl -sI https://aceparts.co.th/hello-world/` → `308` to `/`.
- [ ] If the certificate came from manual DNS-01, re-issue it over HTTP-01
      ([Certificate](#certificate)).

After:

- [ ] Google Search Console: verify the domain (DNS TXT record), remove the old
      `wp-sitemap.xml`, submit `https://aceparts.co.th/sitemap.xml`, watch Pages →
      "Not found (404)" for a few weeks.
- [ ] Bing Webmaster Tools: import the site from Search Console and submit the
      sitemap (Bing also feeds ChatGPT search and Copilot).
- [ ] Rich Results Test on `/` and one `/our-services/<slug>/` page: Organization,
      WebSite, Service and BreadcrumbList with no errors.
- [ ] After a week without HTTPS problems, raise HSTS in
      `scripts/nginx/aceparts.conf` to `max-age=31536000` and reload nginx.
- [ ] Restore the DNS TTL.
- [ ] Shut down the WordPress hosting once the backup period ends.

## Known gaps

- **Port 3001 is reachable from the whole LAN** in plain HTTP, and Docker's
  iptables rules bypass ufw. The app believes any `X-Forwarded-For` it receives,
  so a LAN host talking to 3001 directly can pick its own rate-limit key. To allow
  only the nginx host, on `websmart`:

  ```bash
  sudo iptables -I DOCKER-USER -p tcp -m conntrack --ctorigdstport 3001 ! -s 172.22.22.170 -j DROP
  ```

  Not persistent across reboots on its own; save it with the host's usual
  firewall tooling. Requests from `websmart` itself do not pass this chain, so
  the step 4 checks keep working.
- **`unhealthy` does not restart the container.** `restart: unless-stopped` only
  reacts to the process exiting; a wedged process shows `unhealthy` in
  `docker compose ps` and stays up.
- **The port binding needs `172.22.22.201` to exist when Docker starts.** If the
  container is missing after a reboot, check `ip addr`, then
  `sudo docker compose up -d`.
- **Rate limiting is per container, in memory.** It resets on restart and would
  multiply with replicas. Fine for one container.
- **Old image URLs** (`/wp-content/uploads/...`) are not redirected; they 404.
  Only matters if they are linked from elsewhere or rank in Google Images.
- **An unknown product or service slug returns 200**, not 404 (streamed shell
  with Cache Components). The page is the 404 page with `noindex`, so it is not
  indexed. Unknown top-level paths return a real 404.
