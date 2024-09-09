FROM node:20.10.0-slim AS base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml /app

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE ${PORT}

CMD [ "node", "dist/main" ]
