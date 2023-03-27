FROM node:18-alpine as builder

WORKDIR /app

COPY ["package.json", "package-lock.json*","tsconfig.json",".env", "/app/"]

RUN npm ci

COPY ["src", "/app/src"]

RUN npm run build

FROM node:18-alpine

ENV NODE_ENV=production

EXPOSE 80

WORKDIR /app

COPY --from=builder ["/app/package.json", "/app/package-lock.json*" ,"/app/.env", "/app/"]

COPY --from=builder ["/app/dist", "/app/dist"]

RUN npm ci

RUN mkdir .logs

CMD [ "node", "dist/index.js" ]