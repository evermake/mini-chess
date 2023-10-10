todo

`src/web-app.d.ts` contains type declarations for Telegram Web App API (`window.Telegram.WebApp`). We need to declare these types explicitly for two reasons:
1. To tell TypeScript that there is Web App functionality, so it will typecheck and compile the code that uses the API correctly;
2. To use hints and autocompletions provided by the IDE, when accessing `window.Telegram.WebApp`.


## Setup Guide

1. Install dependencies
