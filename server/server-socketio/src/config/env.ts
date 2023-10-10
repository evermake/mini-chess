const ENV = process.env.ENV
const IS_PRODUCTION = ENV === "production"
const GAME_SOCKET_PORT = Number(process.env.GAME_SOCKET_PORT)
const GAME_SOCKET_TOKEN_SECRET = process.env.TOKEN_SECRET

if (IS_PRODUCTION && !GAME_SOCKET_TOKEN_SECRET) {
  throw new Error("Provide TOKEN_SECRET environment variable")
}

export const config = {
  port: GAME_SOCKET_PORT,
  tokenSecret: GAME_SOCKET_TOKEN_SECRET ?? "fallback-secret",
}
