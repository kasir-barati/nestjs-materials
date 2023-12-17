ARG APP_PORT
ARG APP_WORKDIR

FROM node:20.10.0-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Install package-manager
RUN corepack enable
WORKDIR ${APP_WORKDIR}
COPY . ${APP_WORKDIR}
RUN pnpm fetch
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM base as build
RUN pnpm run build


FROM base
COPY --from=build ${APP_WORKDIR}/dist ${APP_WORKDIR}/dist
EXPOSE ${APP_PORT}
CMD [ "pnpm", "start" ]


