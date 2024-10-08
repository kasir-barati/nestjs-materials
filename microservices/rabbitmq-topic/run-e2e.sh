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

TRACER=false
for arg in "$@"; do
  if [ "$arg" == "--tracer" ]; then
    TRACER=true
    break
  fi
done

if [ "$TRACER" == true ]; then
  docker compose exec -T message-broker rabbitmqctl trace_on
  docker compose exec -T message-broker rabbitmqadmin -u rabbitmq -p password declare queue name=tracer durable=true
  docker compose exec -T message-broker rabbitmqadmin -u rabbitmq -p password declare binding source=amq.rabbitmq.trace destination_type=queue destination=tracer routing_key=publish.#
  docker compose exec -T message-broker rabbitmqadmin -u rabbitmq -p password declare binding source=amq.rabbitmq.trace destination_type=queue destination=tracer routing_key=deliver.#
fi

echo ""
echo "Create openaApi.json..."
echo ""
npx ts-node --transpile-only -r tsconfig-paths/register apps/audit-log-e2e/utils/create-openapi-json.util.ts
npx ts-node --transpile-only -r tsconfig-paths/register apps/driver-api-e2e/utils/create-openapi-json.util.ts
npx ts-node --transpile-only -r tsconfig-paths/register apps/verification-api-e2e/utils/create-openapi-json.util.ts

echo ""
echo "Generate api-client..."
echo ""
npx openapi-generator-cli generate -i /local/apps/audit-log-e2e/openApi.json -o /local/apps/audit-log-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/driver-api-e2e/openApi.json -o /local/apps/driver-api-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true
npx openapi-generator-cli generate -i /local/apps/verification-api-e2e/openApi.json -o /local/apps/verification-api-e2e/api-client -g typescript-axios --additional-properties=useSingleRequestParameter=true

echo ""
echo "Run tests..."
echo ""
npx jest --config apps/audit-log-e2e/jest-e2e.config.ts
npx jest --config apps/driver-api-e2e/jest-e2e.config.ts
npx jest --config apps/verification-api-e2e/jest-e2e.config.ts
