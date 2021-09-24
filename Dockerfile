FROM node:14-alpine AS build
WORKDIR /sln
COPY package.json pnpm-lock.yaml ./
RUN npx pnpm i
COPY main.ts worker.ts tsconfig.json ./
RUN npm run build
RUN npm prune --production
RUN mv ./dist/main.js ./dist/main.mjs && mv ./dist/worker.js ./dist/worker.mjs

FROM node:14-alpine
WORKDIR /app
COPY --from=build /sln/node_modules ./node_modules
COPY --from=build /sln/dist ./dist

EXPOSE 3000
CMD ["node", "./dist/main.mjs"]
