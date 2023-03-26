from node:18-alpine

EXPOSE 80

WORKDIR /app

COPY ["package.json", "package-lock.json*","tsconfig.json",".env", "/app/"]

RUN npm ci

ENV NODE_ENV=production

COPY ["src", "/app/src"]

RUN npm run build

run mkdir .logs

CMD [ "node", "dist/index.js" ]
