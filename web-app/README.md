# Chess Mini App — Web App

## Stack Overview

- React.js — Web App is built with the React.js framework.
  I found it convenient to use, for example, we can create useful wrappers around
  Telegram Web App API (check out the [`./src/components/MainButton.tsx`](./src/components/MainButton.tsx) component, for example).
- Vite — minimalistic, modern and fast bundler and builder.
  I've chosen it, because requires minimum configuration and let's you start
  developing right away.
- CSS Modules — CSS Modules are used for styling components.
  It's a convenient way to keep styles scoped to a component and avoid naming collisions.

## Setup Guide

0. Install `pnpm` package manager (faster `npm` alternative)
1. Install dependencies by running:

```bash
pnpm install
```

2. Now you can run the Web App in development mode by running:

```bash
pnpm run dev
```

Note that you need to have a server running in order to play chess, and also
you need to register your Mini App in the [BotFather](https://t.me/BotFather).

If you don't want to deploy frontend and enjoy HMR (Hot Module Replacement)
while developing, you can use tools like `ngrok` to expose your local server to the Internet.

3. After you've finished developing, you can build the production build of the Web App by running:

```bash
pnpm run build
```

## Project Structure

Chess Mini App actually has 2 Web Apps.
Each separate Web App is located at its own sub-directory in the `./src/apps` directory.

We also need to tell Vite that it's necessary to split the Web App into two separate
bundles, check Vite's configuration file at `./vite.config.ts` for more details.

---

Both Web Apps like all React apps consist of components.
Check out components used by the application in the `./src/components` directory.

Generally, each component is located in its own sub-directory and consists of:
- `ComponentName.tsx` — component implementation
- `ComponentName.module.scss` — component styles

---

`src/web-app.d.ts` contains type declarations for Telegram Web App API (`window.Telegram.WebApp`). We need to declare these types explicitly for two reasons:
1. To tell TypeScript that there is Web App functionality, so it will typecheck and compile the code that uses the API correctly;
2. To use hints and autocompletions provided by the IDE, when accessing `window.Telegram.WebApp`.

Feel free to reuse this file in your own projects.

---
