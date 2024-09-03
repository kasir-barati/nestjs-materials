docker compose run -d -e STRIPE_ENV=test payment-service

npx jest --config apps/payment-service/test/jest-e2e.config.ts
