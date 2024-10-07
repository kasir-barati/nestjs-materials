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
# endregion

echo ""
echo "Create openaApi.json..."
echo ""
npx ts-node --transpile-only -r tsconfig-paths/register apps/driver-api/test/utils/create-openapi-json.util.ts
npx ts-node --transpile-only -r tsconfig-paths/register apps/verification-api/test/utils/create-openapi-json.util.ts

echo ""
echo "Generate api-client..."
echo ""
npx openapi-generator-cli generate -i /local/apps/driver-api/openApi.json -o /local/apps/audit-log-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/driver-api/openApi.json -o /local/apps/driver-api-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/verification-api/openApi.json -o /local/apps/verification-api-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true

echo ""
echo "Run tests..."
echo ""
npx jest --config apps/driver-api/test/jest-e2e.config.ts
npx jest --config apps/verification-api/test/jest-e2e.config.ts
