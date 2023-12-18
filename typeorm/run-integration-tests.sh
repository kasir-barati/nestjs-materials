#/bin/bash

clear

# The simplest way to make a bash script exit when an error occurs
set -e

# Install everything
pnpm i --frozen-lockfile

# Cleanup
docker compose --profile integration-tests down -v

sleep 20

# Create openapi
pnpm openapi:create
# Generate openapi 
pnpm openapi:generate

# Rebuild
docker compose --profile integration-tests build
# Create containers
docker compose --profile integration-tests up -d

# Check if it is healthy
pnpx wait-on --timeout 10s http://localhost:3000/health

# Run integration tests
pnpm jest --config jest-integration.config.ts