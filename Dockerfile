FROM node:20 AS builder

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package* .

RUN npm ci --production

COPY --from=builder /app/out .

EXPOSE 3000

CMD ["npm", "run", "start"]