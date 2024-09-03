#! /bin/bash

echo ""
echo "Generate api-client..."
echo ""
npx openapi-generator-cli generate -i /local/apps/reservation-service/openApi.json -o /local/apps/reservation-service/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/auth-service/openApi.json -o /local/apps/auth-service/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
