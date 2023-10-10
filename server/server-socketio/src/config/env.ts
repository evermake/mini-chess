const GAME_SOCKET_PORT = Number(process.env.GAME_SOCKET_PORT)
const TOKEN_SECRET = process.env.TOKEN_SECRET
const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN

if (!TOKEN_SECRET) {
  throw new Error("Provide TOKEN_SECRET environment variable")
}

export const config = {
  port: GAME_SOCKET_PORT || 4001,
  tokenSecret: TOKEN_SECRET,
  corsAllowedOrigin: CORS_ALLOWED_ORIGIN,
}
