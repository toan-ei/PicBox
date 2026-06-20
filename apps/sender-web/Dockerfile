# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/ ./packages/
COPY sender-web/ ./sender-web/

# Single install from workspace root — sender-web is now a workspace member
# npm hoists next/react to /app/node_modules, symlinks @picbox/* for webpack
RUN --mount=type=cache,target=/root/.npm \
    npm install --registry=https://registry.npmmirror.com

WORKDIR /app/sender-web
RUN npm run build

FROM node:20-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages ./packages
COPY --from=builder --chown=app:app /app/sender-web/node_modules ./sender-web/node_modules
COPY --from=builder --chown=app:app /app/sender-web/.next ./sender-web/.next
COPY --from=builder --chown=app:app /app/sender-web/public ./sender-web/public
COPY --from=builder --chown=app:app /app/sender-web/package.json ./sender-web/package.json

USER app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/sender-web
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start"]