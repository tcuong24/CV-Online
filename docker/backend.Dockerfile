# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    PUPPETEER_SKIP_DOWNLOAD=true

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate \
 && apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/cv-online-nestjs/package.json packages/cv-online-nestjs/package.json
COPY packages/cv-online-nestjs/prisma packages/cv-online-nestjs/prisma
COPY packages/cv-online-nextjs/package.json packages/cv-online-nextjs/package.json
RUN --mount=type=cache,id=pnpm-backend,target=/pnpm/store pnpm install --frozen-lockfile

COPY packages/cv-online-nestjs ./packages/cv-online-nestjs
RUN pnpm --filter cv-online-nestjs build \
 && pnpm --filter cv-online-nestjs deploy --prod --legacy /output/backend \
 && cd /output/backend \
 && ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=9999 \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/* /var/log/*

WORKDIR /app
COPY --from=build /output/backend ./
COPY --from=build /workspace/packages/cv-online-nestjs/dist ./dist
COPY --from=build /workspace/packages/cv-online-nestjs/prisma ./prisma
COPY docker/backend-entrypoint.sh /usr/local/bin/backend-entrypoint
RUN chmod +x /usr/local/bin/backend-entrypoint

EXPOSE 9999
HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS 'http://127.0.0.1:9999/api/templates?page=1&limit=1' >/dev/null || exit 1

ENTRYPOINT ["backend-entrypoint"]
