#! /bin/bash

echo ""
echo "Create openaApi.json..."
echo ""
npx ts-node --transpile-only -r tsconfig-paths/register apps/reservation-service/test/utils/create-openapi-json.util.ts
npx ts-node --transpile-only -r tsconfig-paths/register apps/auth-service/test/utils/create-openapi-json.util.ts