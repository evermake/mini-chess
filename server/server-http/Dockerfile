FROM node:16

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i -g pnpm
RUN pnpm i

COPY ./.env ./
COPY ./prisma ./
COPY ./server-http ./server-http
RUN pnpm prisma:generate
RUN pnpm build:http

EXPOSE 4000

CMD ["pnpm", "start:http"]
