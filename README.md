# Portfolio

pranav-agarwal.com, in two parts:

- **`web/`**: the public site. [Astro](https://astro.build) + Tailwind CSS, built to static HTML. Cloudflare Workers Builds builds and deploys it on every push to `main` (a Worker with static assets, like grain and NomadSafe's sites). It's its own project with its own lockfile.
- **`cms/`**: a [Payload](https://payloadcms.com) CMS for editing the content, running on the home server at `http://100.126.38.45:3000/admin` (Tailscale only).

The site's content lives in the repo, in `web/src/content/` (JSON plus images). When you save something in the CMS, it exports the content there and pushes it to `main`; Cloudflare then deploys it. Changes are live a minute or two later.

## Working on the site

```sh
cd web
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # web/dist
```

The site needs only `web/`; it never talks to the CMS.

## Working on the CMS

```sh
cp .env.example cms/.env.local   # set PAYLOAD_SECRET and an admin email/password
pnpm install
pnpm dev:cms                     # http://localhost:3200/admin
pnpm export                      # write its content into web/src/content
```

On first start the CMS creates its database (`cms/data/portfolio.db`), the admin user, and the initial content from `cms/src/payload/seed/`.

After editing anything in `cms/src/payload/collections` or `cms/src/payload/globals`:

```sh
pnpm --filter portfolio-cms generate:types
pnpm --filter portfolio-cms migrate:create <name>   # production applies migrations on boot
```

## Editing content

- **Projects**: the Work page. `Section` picks the group, `Order` sorts within it, `Show on home page` puts it under Selected work.
- **Posts**: the blog. Save as draft, then Publish. Only published posts are public.
- **Videos**: YouTube links for the Videos section. Thumbnails come from YouTube unless you upload one.
- **Community**: the Community page. `Kind` puts an entry under communities, talks, or mentoring and judging; `Order` sorts within it.
- **Profile**: everything on the home page.
- **SEO & site**: title, description, link preview image, analytics ID.

## Deploying

**Site**: Cloudflare → Workers & Pages → `portfolio`, connected to this GitHub repo, with root directory `web`, build command `pnpm install --frozen-lockfile && pnpm build` and deploy command `npx wrangler deploy`. The custom domains (pranav-agarwal.com, www) are attached in the dashboard. The Worker's name and account are in `web/wrangler.jsonc`.

**CMS**: the Docker image (see `docker-compose.yml`). Its database, uploads and repo checkout live in `/app/data`, so mount a volume there, and provide these in `portfolio.env`:

```
PAYLOAD_SECRET=<openssl rand -hex 32>
PAYLOAD_ADMIN_EMAIL=you@example.com
PAYLOAD_ADMIN_PASSWORD=<strong password>
GITHUB_TOKEN=<fine-grained token: this repo, Contents read and write>
```

The admin user is only created when the database has no users. Without `GITHUB_TOKEN` the CMS still works, but saving doesn't publish.
