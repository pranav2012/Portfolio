# Portfolio

Next.js site with a built-in [Payload](https://payloadcms.com) CMS. Everything on the site (profile, experience, projects, blog posts, SEO, social links) is edited at `/admin`; changes show up on the next page load, with no rebuild or deploy.

## Local development

```sh
cp .env.example .env.local   # set PAYLOAD_SECRET and an admin email/password
pnpm install
pnpm dev
```

On first start the database (`data/portfolio.db`) is created, the admin user from `.env.local` is added, and the initial content is seeded from `src/payload/seed/`.

## Editing content

- **Projects**: the Work page. `Section` picks the group, `Order` sorts within it, `Show on home page` puts it under Recent Work.
- **Posts**: the blog. Save as draft, then Publish. Only published posts are public.
- **Profile**: everything on the home page.
- **SEO & site**: title, description, link preview image, analytics ID.

## Changing the schema

After editing anything in `src/payload/collections` or `src/payload/globals`:

```sh
pnpm generate:types
pnpm migrate:create <name>   # production applies migrations on boot
```

Run `pnpm generate:importmap` if you add custom admin components.

## Deploying

The image is self-contained. The database and uploads live in `/app/data`, so mount a volume there (see `docker-compose.yml`) and provide these variables (e.g. in `portfolio.env`):

```
PAYLOAD_SECRET=<openssl rand -hex 32>
PAYLOAD_ADMIN_EMAIL=you@example.com
PAYLOAD_ADMIN_PASSWORD=<strong password>
```

The admin user is only created when the database has no users, so nobody can claim `/admin` on a fresh deploy.
