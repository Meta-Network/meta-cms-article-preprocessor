FROM node:14-alpine AS build
WORKDIR /sln
COPY package.json pnpm-lock.yaml ./
RUN npx pnpm i
COPY *.ts tsconfig.json ./
RUN npm run build
RUN npm prune --production
RUN ls dist/*.js | xargs -I {} sh -c 'sed -i "s/\.js/\.mjs/g" $1 && mv "$1" "${1%.js}".mjs' _ {}

FROM node:14-alpine
WORKDIR /app
COPY --from=build /sln/node_modules ./node_modules
COPY --from=build /sln/dist ./dist

EXPOSE 3000
CMD ["node", "./dist/main.mjs"]
