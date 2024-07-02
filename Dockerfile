FROM node:20-bookworm-slim AS builder
WORKDIR /work

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-bookworm-slim as runner
WORKDIR /work

ENV NODE_ENV production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /work/dist ./dist

ENTRYPOINT ["npx", "majiang-log"]
