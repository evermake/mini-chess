FROM node:16

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i -g pnpm
RUN pnpm i

COPY ./.env ./
COPY ./prisma ./
COPY ./server-socketio ./server-socketio
RUN pnpm prisma:generate
RUN pnpm build:socketio

EXPOSE 4001

CMD ["pnpm", "start:socketio"]
