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

CI (`.github/workflows/ci.yml`) runs `lint` and `build` on every push and pull request.

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
