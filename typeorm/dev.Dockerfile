# https://stackoverflow.com/a/58697226/8784518
# The variables defined by ARG instruction have a scope from the definition to the end of the build stage where it was defined. If it was defined in the beginning of the Dockerfile (outside of any build stage), then its scope is restricted to only FROM instructions. Outside of their scope, variables will be resolved to empty string which may lead to unintended behaviour.
ARG APP_PORT
ARG APP_WORKDIR


FROM node:20.10.0-slim AS base
ARG APP_WORKDIR
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR ${APP_WORKDIR}
COPY pnpm-lock.yaml ${APP_WORKDIR}
RUN pnpm fetch


FROM base AS build
ARG APP_WORKDIR
COPY . ${APP_WORKDIR}
RUN pnpm install -r --offline
RUN pnpm run build


FROM base
ARG APP_PORT
ARG APP_WORKDIR
COPY --from=build ${APP_WORKDIR} ${APP_WORKDIR}
EXPOSE ${APP_PORT}
CMD [ "pnpm", "start" ]
