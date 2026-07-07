FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY publisher.js consumer.js ./

CMD ["node", "publisher.js"]
