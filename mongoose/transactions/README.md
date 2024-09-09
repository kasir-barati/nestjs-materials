# `@Transactional`

## How to run it

1. `cp .env.example .env`.
2. `pnpm install`.
3. `pnpm openapi:create`.
4. `pnpm apiclient:gennerate`
5. `docker compose up --build -d`.
6. `pnpm test:e2e`.

## Does not work

https://github.com/GO-DIE/mongoose-transaction-decorator/issues/1
