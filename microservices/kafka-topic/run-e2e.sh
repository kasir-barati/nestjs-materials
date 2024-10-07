#! /bin/bash

clear
docker compose down -v

BUILD=false
for arg in "$@"; do
  if [ "$arg" == "--build" ]; then
    BUILD=true
    break
  fi
done

if [ "$BUILD" == true ]; then
    DOCKER_BUILDKIT=0 docker-compose build --no-cache
fi
docker compose up -d

echo ""
echo "Create openaApi.json..."
echo ""
npx ts-node --transpile-only -r tsconfig-paths/register apps/auth-e2e/utils/create-openapi-json.util.ts
npx ts-node --transpile-only -r tsconfig-paths/register apps/audit-log-e2e/utils/create-openapi-json.util.ts

echo ""
echo "Generate api-client..."
echo ""
npx openapi-generator-cli generate -i /local/apps/auth/openApi.json -o /local/apps/auth-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/audit-log/openApi.json -o /local/apps/audit-log-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true

echo ""
echo "Run tests..."
echo ""
npx jest --config apps/auth-e2e/jest-e2e.config.ts
npx jest --config apps/audit-log-e2e/jest-e2e.config.ts
