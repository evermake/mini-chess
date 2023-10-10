import { createHmac } from "node:crypto"

export default () => {
  const ENV = process.env.ENV
  const IS_PRODUCTION = ENV === "production"
  const GAME_HTTP_PORT = Number(process.env.GAME_HTTP_PORT)
  const GAME_HTTP_TOKEN_SECRET = process.env.GAME_HTTP_TOKEN_SECRET
  const GAME_HTTP_SERVER_URL = process.env.GAME_HTTP_SERVER_URL
  const GAME_HTTP_ENCODING_IV = process.env.GAME_HTTP_ENCODING_IV
  const GAME_HTTP_ENCODING_KEY = process.env.GAME_HTTP_ENCODING_KEY
  const GAME_HTTP_AUTHORIZATION_EXPIRES_IN_MINUTES = Number(process.env.AUTHORIZATION_EXPIRES_IN_MINUTES)
  const GAME_HTTP_BOT_INVITATION_PREFIX = process.env.BOT_INVITATION_PREFIX
  const BOT_TOKEN = process.env.BOT_TOKEN

  if (IS_PRODUCTION && !GAME_HTTP_TOKEN_SECRET) {
    throw new Error("Provide GAME_HTTP_TOKEN_SECRET environment variable")
  }

  return {
    port: GAME_HTTP_PORT,
    tokenSecret: GAME_HTTP_TOKEN_SECRET ?? "fallback-secret",
    gameServerUrl: GAME_HTTP_SERVER_URL,
    iv: GAME_HTTP_ENCODING_IV,
    key: GAME_HTTP_ENCODING_KEY,
    userVerificationKey: createHmac("SHA256", "WebAppData").update(BOT_TOKEN).digest(),
    botToken: BOT_TOKEN,
    authorizationExpiresInMinutes: GAME_HTTP_AUTHORIZATION_EXPIRES_IN_MINUTES,
    botInvitationPrefix: GAME_HTTP_BOT_INVITATION_PREFIX,
  }
}
