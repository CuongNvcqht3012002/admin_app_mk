# build stage
FROM node:18.15.0-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build

# deploy stage
FROM node:18.15.0-alpine AS deploy

WORKDIR /app

COPY --from=build /app/build .

CMD ["yarn", "start"]