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

./scripts/create-openapi.sh
./scripts/generate-api-client.sh

echo ""
echo "Run tests..."
echo ""
npx jest --config apps/reservation-service/test/jest-e2e.config.ts
npx jest --config apps/auth-service/test/jest-e2e.config.ts
npx jest --config apps/dead-letter-notification-service/test/jest-e2e.config.ts
npx jest --config apps/notification-service/test/jest-e2e.config.ts

./scripts/run-payment-e2e-tests.sh
