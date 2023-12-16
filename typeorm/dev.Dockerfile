FROM node:20.10.0-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR ${APP_WORKDIR}
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY pnpm-lock.yaml ${APP_WORKDIR}
RUN pnpm fetch

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline --prod


FROM base as build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline
RUN pnpm run build


FROM base
COPY --from=prod-deps ${APP_WORKDIR}/node_modules ${APP_WORKDIR}/node_modules
COPY --from=build ${APP_WORKDIR}/dist ${APP_WORKDIR}/dist
COPY . ${APP_WORKDIR}
EXPOSE ${APP_PORT}
CMD [ "pnpm", "start" ]


