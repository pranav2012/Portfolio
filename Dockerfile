# Runs the CMS (Payload, /admin). After each change it exports the content
# into the site's GitHub repo and pushes it; Cloudflare builds and deploys
# the site (web/) from there.
FROM node:24-slim AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY cms/package.json cms/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/cms/node_modules ./cms/node_modules
COPY package.json pnpm-workspace.yaml ./
COPY cms ./cms
RUN pnpm --filter portfolio-cms build

FROM base AS runner
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/portfolio.db
ENV MEDIA_DIR=/app/data/media
ENV CMS_URL=http://localhost:3000
ENV PUBLISH_COMMAND='sh /app/cms/scripts/publish.sh'
COPY --from=builder /app /app
WORKDIR /app/cms
# The CMS database, uploaded images and the site checkout live here; mount a
# volume on it.
VOLUME /app/data
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
