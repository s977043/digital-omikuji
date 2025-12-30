# builder ステージ: ビルド環境
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# production ステージ: 実行環境
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/public /app/public
COPY --from=builder /app/build /app/build
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "run", "start"]
