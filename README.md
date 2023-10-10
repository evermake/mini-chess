# Chess — Telegram Mini App

> Try it yourself! 👉 [@MiniChessBot](https://t.me/MiniChessBot)

## Introduction

Chess Mini App — is the [Telegram Mini App](https://core.telegram.org/bots/webapps) that enables Telegram users to easily play the classical game with each other without leaving the Telegram app.

## Bot Usage

- To create a lobby open the link [t.me/MiniChessBot/new-game](https://t.me/MiniChessBot/new-game)
- To join a lobby open the link sent by the bot after lobby creation.

## Repo Structure

## Setup Guide

Both frontend and backend are written in TypeScript and all packages installed via `pnpm` package manager.

### Web App (frontend)

Chess Mini App actually consists of two Web Apps: first is used to provide an interface for a user to create a new lobby, and the second one is actually for playing chess in the created lobby.

The only thing Telegram client needs to open your Web App is the URL to a web page of your Web App, and since we have 
Chess Web App actually consists of two SPAs (Single Page Applications) created with React framework and built with Vite builder.
After building the project, Vite builder will generate static files with 2 `index.html` pages:
one for the Lobby Creat

### Server (backend)

Chess Mini App is the multiplayer game, it means that two players need to communicate somehow.
Therefore, a separate server is required
See [server](./server/) directory for the Chess server implementation details.

## License

[MIT](./LICENSE)
