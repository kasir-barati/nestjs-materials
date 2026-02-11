FROM node:24.13-alpine3.23 AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS dev
EXPOSE 3000 9229
CMD ["pnpm", "start:dev"]

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS prod
EXPOSE 3000
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
CMD ["pnpm", "start:prod"]

