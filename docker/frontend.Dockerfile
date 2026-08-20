# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1 \
    PUPPETEER_SKIP_DOWNLOAD=true

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/cv-online-nestjs/package.json packages/cv-online-nestjs/package.json
COPY packages/cv-online-nestjs/prisma packages/cv-online-nestjs/prisma
COPY packages/cv-online-nextjs/package.json packages/cv-online-nextjs/package.json
RUN --mount=type=cache,id=pnpm-frontend,target=/pnpm/store pnpm install --frozen-lockfile

COPY packages/cv-online-nextjs ./packages/cv-online-nextjs

ARG NEXT_PUBLIC_API_URL=http://localhost:9999/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter nextjs-frontend build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app
COPY --from=build /workspace/packages/cv-online-nextjs/.next/standalone ./
COPY --from=build /workspace/packages/cv-online-nextjs/.next/static ./packages/cv-online-nextjs/.next/static
COPY --from=build /workspace/packages/cv-online-nextjs/public ./packages/cv-online-nextjs/public

EXPOSE 3000
CMD ["node", "packages/cv-online-nextjs/server.js"]
