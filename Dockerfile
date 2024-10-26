# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG OS_VERSION=bookworm-slim

FROM node:${NODE_VERSION}-${OS_VERSION} AS base

FROM base AS builder
WORKDIR /work

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci

COPY rollup.config.js tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS runner
WORKDIR /work

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev

USER node

COPY --from=builder --chown=node:node /work/dist ./dist

ENTRYPOINT ["npx", "majiang-log"]
