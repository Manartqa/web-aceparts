# syntax=docker/dockerfile:1

# Debian slim rather than Alpine: sharp, which Next uses to resize images,
# ships prebuilt binaries for glibc.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined into the bundle, sitemap.xml, robots.txt and the
# canonical tags at BUILD time. They are build args: setting them on
# `docker run` has no effect. Change one and rebuild the image.
ARG NEXT_PUBLIC_SITE_URL
# Set to 1 for staging so search engines don't index it.
ARG NEXT_PUBLIC_NOINDEX
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN test -n "$NEXT_PUBLIC_SITE_URL" || { \
      echo "ERROR: --build-arg NEXT_PUBLIC_SITE_URL=... is required (baked in at build time)."; \
      exit 1; \
    }

RUN npm run build


FROM node:22-slim AS runner
WORKDIR /app

# 0.0.0.0 inside the container; keep it private by publishing the port on
# 127.0.0.1 only, so it is reachable through nginx alone.
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# output: "standalone" traces only the modules the server uses. It leaves out
# .next/static and public, so copy both, or the site has no CSS, JS or images.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
