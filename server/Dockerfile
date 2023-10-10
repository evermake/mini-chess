FROM node:16

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i -g pnpm
RUN pnpm i

COPY ./prisma ./
COPY ./server-socketio ./server-socketio
COPY ./server-http ./server-http
RUN pnpm prisma:generate
RUN pnpm build:socketio
RUN pnpm build:http

CMD ["echo", "editme"]
