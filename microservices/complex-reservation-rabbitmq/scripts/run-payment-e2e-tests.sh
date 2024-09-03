sed -i 's/^STRIPE_ENV=.*/STRIPE_ENV=test/' apps/payment-service/.env

docker compose up -d --force-recreate payment-service

npx jest --config apps/payment-service/test/jest-e2e.config.ts

sed -i 's/^STRIPE_ENV=.*/STRIPE_ENV=development/' apps/payment-service/.env
