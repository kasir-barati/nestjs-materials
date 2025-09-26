FROM node:20.10.0-slim AS development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN corepack enable

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY pnpm-lock.yaml .
RUN pnpm fetch

EXPOSE 3000 9229

COPY . .
RUN pnpm install -r --offline