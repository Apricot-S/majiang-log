# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
ARG OS_VERSION=trixie-slim

FROM node:${NODE_VERSION}-${OS_VERSION} AS base

FROM base AS builder
WORKDIR /work

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci

ENV NODE_ENV=production

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=tsdown.config.ts,target=tsdown.config.ts \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=src,target=src \
    npm run build

FROM base AS runner
WORKDIR /work

ENV NODE_ENV=production

COPY package.json package-lock.json ./

USER node

COPY --from=builder --chown=node:node /work/dist ./dist

ENTRYPOINT ["npx", "majiang-log"]
