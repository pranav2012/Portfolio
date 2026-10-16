FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/portfolio.db
ENV MEDIA_DIR=/app/data/media
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# Images used to seed an empty database on first boot.
COPY --from=builder /app/src/payload/seed/images ./src/payload/seed/images
# The CMS database and uploaded images live here; mount a volume on it.
VOLUME /app/data
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
