# A.C.E. Parts website

Next.js rebuild of [aceparts.co.th](https://aceparts.co.th/), replacing the WordPress site.
The goal is the same structure and content with a more modern design.

## Stack

- Next.js 16 (App Router, static pages) · React 19 · TypeScript
- Tailwind CSS 4
- Fonts: Titillium Web (headings) and Raleway (body), the same as the WordPress site

## Getting started

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

| `npm run test:e2e` | Playwright tests against the production build (desktop + mobile) |

CI (`.github/workflows/ci.yml`) runs `lint` and `build`, and the Playwright suite, on every
push to `main` and every pull request.

## Deployment

Docker image behind nginx on a VM, built with `scripts/deploy.ps1`. Steps,
rollback and the go-live checklist are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Testing

`e2e/` holds Playwright tests that build the site and run it with `next start` on port 3100:

- `pages.spec.ts`: every page returns 200 with a title, `<h1>` and canonical URL; 404s;
  old WordPress redirects; sitemap and robots.
- `navigation.spec.ts`: desktop dropdown, mobile menu, product pager, no horizontal scroll.
- `contact.spec.ts`: form validation and the honeypot. These never send email.
- `accessibility.spec.ts`: axe (WCAG 2 A/AA) finds no serious or critical issues on any page.

First run: `npx playwright install chromium`.

## Project structure

```
src/
├── app/                  # Routes (App Router)
├── content/              # All site content: site, products, services, pages (import from "@/content")
├── components/
│   ├── layout/           # SiteHeader, SiteFooter
│   ├── common/           # Shared: PageHero, Breadcrumb, SectionHeading, ProductCard, ServiceCard,
│   │                     #         CtaBanner, PartnersSection, ContactList
│   └── partials/         # Page sections: Home, About, Products, Services, Client, Contact
public/images/            # Images migrated from the WordPress site
```

Imports use the `@/` alias (maps to `src/`).

## Editing content

Text, links and image paths live in `src/content/`. Images go in `public/images/`.
Product and service detail pages are generated from `products.ts` and `services.ts`,
so adding an entry there adds the page.

## Contact form

`/contact-us/` submits to a Server Action (`src/app/contact-us/actions.ts`) that sends
the enquiry with Microsoft Graph `sendMail`, using an Entra ID app with the `Mail.Send`
application permission. Copy `.env.example` to `.env.local` and fill in the values;
the same variables must be set on the host. Without them the form shows a fallback
message with the company email and phone.

Spam protection: a hidden honeypot field, a 3-second minimum fill time and an in-memory
limit of 5 messages per IP per 10 minutes.

## URLs

Routes keep the WordPress URLs, including the trailing slash (`trailingSlash: true` in
`next.config.ts`), so existing links and search rankings keep working:

| Page | URL |
|---|---|
| About | `/about-us/` |
| Products | `/products/`, `/portfolio/<slug>/` |
| Services | `/our-services/`, `/our-services/<slug>/` |
| Clients | `/our-client/` |
| Contact | `/contact-us/` |

Don't rename a URL without adding a redirect.

Old WordPress URLs with no page here are redirected permanently in `next.config.ts`:
`/portfolio-category/products/` goes to `/products/`, and the theme's demo posts and
archives (`/category/…`, `/tag/…`, `/author/…`, `/type/…`, header/footer builders) go to `/`.

## SEO

- Per-page title, description, canonical URL and Open Graph via `pageMetadata()` in `src/lib/seo.ts`.
- `/sitemap.xml` and `/robots.txt` are generated from `src/app/sitemap.ts` and `src/app/robots.ts`.
- JSON-LD: `Organization` on the home page, `BreadcrumbList` on every inner page.
- The public origin comes from `NEXT_PUBLIC_SITE_URL` (default `https://aceparts.co.th`).
