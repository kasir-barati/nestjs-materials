FROM node:24.13.0-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund --loglevel=warn

COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN npx nest build

ENV NODE_ENV=development
EXPOSE 3000
CMD ["node", "dist/main.js"]
