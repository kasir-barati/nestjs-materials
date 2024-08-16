# https://stackoverflow.com/a/58697226/8784518
# The variables defined by ARG instruction have a scope from the definition to the end of the build stage where it was defined. If it was defined in the beginning of the Dockerfile (outside of any build stage), then its scope is restricted to only FROM instructions. Outside of their scope, variables will be resolved to empty string which may lead to unintended behaviour.
ARG RESERVATION_SERVICE_PORT
ARG MICROSERVICES_WORKDIR


FROM node:20.10.0-slim AS base
ARG MICROSERVICES_WORKDIR
ARG RESERVATION_SERVICE_PORT
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR ${MICROSERVICES_WORKDIR}
COPY package.json pnpm-lock.yaml ${MICROSERVICES_WORKDIR}
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE ${RESERVATION_SERVICE_PORT}
CMD [ "pnpm", "start" ]
