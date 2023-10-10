# Mini-chess http server

This service is responsible for creating, inviting, and connecting players to game lobbies.
It is also responsible for the bot of the game

### Stack

Build with nest.js, prisma, and grammy

## Building and running

### Build

Assuming you are in the directory of this README.md

```
$ cd ../../
$ pnpm i
$ cd server/
$ pnpm prisma:generate
$ pnpm build:http
```

### Running

Assuming you are in the directory of this README.md

```
$ cd ../
$ pnpm start:http
```

Make sure to set environment variables like in ../.env.template

