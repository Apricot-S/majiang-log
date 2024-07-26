# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG OS_VERSION=bookworm-slim

FROM node:${NODE_VERSION}-${OS_VERSION} as base

FROM base AS builder
WORKDIR /work

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base as runner
WORKDIR /work

ENV NODE_ENV production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /work/dist ./dist

ENTRYPOINT ["npx", "majiang-log"]
