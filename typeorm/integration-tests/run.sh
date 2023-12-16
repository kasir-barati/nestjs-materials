#/bin/bash

pnpm i --frozen-lockfile

docker compose --profile integration-tests down -v
docker compose --profile integration-tests up -d

sleep 20

npx --yes wait-on http://localhost:3000/health

ts-node --project ../tsconfig.json --transpile-only -r tsconfig-paths/register ../src/create-openapi-json.ts
pnpx openapi-generator-cli generate -i ../src/smart-control-api/openApi.json -o apps/smart-control-api-integration-tests/src/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true