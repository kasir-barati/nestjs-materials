#! /bin/bash

# region cleanup
echo "Compose down..."
echo ""
docker compose down -v

# endregion

# region bootstrap app & its deps
# Check if --build flag is provided
echo "Start containers..."
echo ""

BUILD=false
for arg in "$@"; do
  if [ "$arg" == "--build" ]; then
    BUILD=true
    break
  fi
done

if [ "$BUILD" == true ]; then
  DOCKER_BUILDKIT=0 docker compose up --build -d
else
  DOCKER_BUILDKIT=0 docker compose up -d
fi
# endregion

# region Create openApi.json files
echo "Create openaApi.json..."
echo ""
npx ts-node --transpile-only -r tsconfig-paths/register apps/reservation-service/test/utils/create-openapi-json.util.ts
# endregion

# region Generate API client.
echo "Generate api-client..."
echo ""
npx openapi-generator-cli generate -i /local/apps/reservation-service/openApi.json -o /local/apps/reservation-service/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
# endregion

echo "Run tests..."
echo ""
npx jest --config apps/reservation-service/test/jest-e2e.config.ts