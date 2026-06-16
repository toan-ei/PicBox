FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages ./packages
COPY apps/sender-web ./apps/sender-web

RUN npm install
RUN npm run build --workspace=apps/sender-web

FROM node:20-alpine
WORKDIR /app/apps/sender-web

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/sender-web/.next ./.next
COPY --from=builder /app/apps/sender-web/public ./public
COPY --from=builder /app/apps/sender-web/package.json ./package.json

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["/app/node_modules/.bin/next", "start"]
