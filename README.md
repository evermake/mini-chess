# Chess — Telegram Mini App

> Try it yourself! 👉 [@MiniChessBot](https://t.me/MiniChessBot)

## Introduction

Chess Mini App — is the [Telegram Mini App](https://core.telegram.org/bots/webapps) that enables Telegram users to easily play the classical game with each other without leaving the Telegram app.

## Bot Usage

Create a lobby by following the link [t.me/MiniChessBot/new-game](https://t.me/MiniChessBot/new-game). After filling a form, bot will send you a link to the lobby that you can share with your friend and start playing!

## Repo Structure

Chess Mini App consits of two parts:
1. [Web App](./web-app/) — the frontend part of the Mini App, that is responsible for creating a new lobby;
2. [Server](./server/) — the backend part of the Mini App, that is responsible for creating a new lobby.

### Web App (frontend)

Chess Mini App actually consists of two Web Apps:
1. First is used to provide an interface for a user to create a new lobby;
2. Second one is actually for playing chess in the created lobby.

Check out their implementation details in the [web-app](./web-app/) directory.

### Server (backend)

Chess Mini App is the multiplayer game, it means that two players need to communicate somehow.
Therefore, a separate server is required.
See [server](./server/) directory for the Chess server implementation details.

## Setup Guide

Both frontend and backend are written in TypeScript and all packages installed via `pnpm` package manager, so it's a prerequisite.

For more details on how to setup each part, check out the corresponding README.md files for [server](./server/) and [web-app](./web-app/).

Project also uses ESLint for linting and formatting that keeps the codebase consistent and easy to read.
Check out the [ESLint config file](./eslint.config.js) for more details.

## License

[MIT](./LICENSE)
