ARG APP_PORT
ARG APP_WORKDIR

FROM node:20.10.0-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Install package-manager
RUN corepack enable
WORKDIR ${APP_WORKDIR}
RUN echo ${APP_WORKDIR}
RUN pnpm --version
COPY ./pnpm-lock.yaml ${APP_WORKDIR}
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


