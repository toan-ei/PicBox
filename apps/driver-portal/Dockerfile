FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/driver-portal ./apps/driver-portal

RUN npm install

WORKDIR /app/apps/driver-portal
RUN npm run build

FROM node:20-alpine
WORKDIR /app/apps/driver-portal

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/driver-portal/.next ./.next
COPY --from=builder /app/apps/driver-portal/package.json ./package.json

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["/app/node_modules/.bin/next", "start"]
