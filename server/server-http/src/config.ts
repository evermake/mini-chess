import { createHmac } from "node:crypto"

export default () => {
  const GAME_HTTP_PORT = Number(process.env.GAME_HTTP_PORT)
  const TOKEN_SECRET = process.env.TOKEN_SECRET
  const GAME_HTTP_SERVER_URL = process.env.GAME_HTTP_SERVER_URL
  const GAME_HTTP_ENCODING_IV = process.env.GAME_HTTP_ENCODING_IV
  const GAME_HTTP_ENCODING_KEY = process.env.GAME_HTTP_ENCODING_KEY
  const GAME_HTTP_AUTHORIZATION_EXPIRES_IN_MINUTES = Number(process.env.AUTHORIZATION_EXPIRES_IN_MINUTES)
  const GAME_HTTP_BOT_INVITATION_PREFIX = process.env.BOT_INVITATION_PREFIX
  const BOT_TOKEN = process.env.BOT_TOKEN

  if (!TOKEN_SECRET) {
    throw new Error("Provide TOKEN_SECRET environment variable")
  }
  if (!GAME_HTTP_ENCODING_IV) {
    throw new Error("Provide GAME_HTTP_ENCODING_IV environment variable")
  }
  if (!GAME_HTTP_ENCODING_KEY) {
    throw new Error("Provide GAME_HTTP_ENCODING_KEY environment variable")
  }
  if (BOT_TOKEN) {
    throw new Error("Provide BOT_TOKEN environment variable")
  }

  return {
    port: GAME_HTTP_PORT ?? 4000,
    tokenSecret: TOKEN_SECRET,
    gameServerUrl: GAME_HTTP_SERVER_URL ?? "http://localhost:4001",
    iv: GAME_HTTP_ENCODING_IV,
    key: GAME_HTTP_ENCODING_KEY,
    userVerificationKey: createHmac("SHA256", "WebAppData").update(BOT_TOKEN).digest(),
    botToken: BOT_TOKEN,
    authorizationExpiresInMinutes: GAME_HTTP_AUTHORIZATION_EXPIRES_IN_MINUTES ?? 10000,
    botInvitationPrefix: GAME_HTTP_BOT_INVITATION_PREFIX ?? "t.me/blah-blah?game=",
  }
}
