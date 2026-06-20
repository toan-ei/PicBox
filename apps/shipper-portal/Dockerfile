# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY shipper-portal ./shipper-portal

RUN --mount=type=cache,target=/root/.npm \
    npm install --registry=https://registry.npmmirror.com

WORKDIR /app/shipper-portal
RUN npm run build

FROM node:20-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app/shipper-portal

COPY --from=builder --chown=app:app /app/node_modules /app/node_modules
COPY --from=builder --chown=app:app /app/packages /app/packages
COPY --from=builder --chown=app:app /app/shipper-portal/.next ./.next
COPY --from=builder --chown=app:app /app/shipper-portal/package.json ./package.json

USER app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["/app/node_modules/.bin/next", "start"]
