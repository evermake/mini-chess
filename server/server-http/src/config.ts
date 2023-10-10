import { createHmac } from "node:crypto"

export default () => {
  const ENV = process.env.ENV
  const IS_PRODUCTION = ENV === "production"
  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
  const TOKEN_SECRET = process.env.TOKEN_SECRET
  const GAME_SERVER_URL = process.env.GAME_SERVER_URL ?? "http://localhost:4001"
  const GAME_ENCODING_IV = process.env.GAME_ENCODING_IV ?? "8a740028dee0dbb40e33fcdfe1c51ffd"
  const GAME_ENCODING_KEY = process.env.GAME_ENCODING_KEY ?? "673d9f6e6e4d7af165eec718f63aef5a6f77d6debc302de5c86af022705c355a"
  const BOT_TOKEN = process.env.BOT_TOKEN ?? "6676215411:AAGWAl_IHTsHU2rLu5BX6fbxsr2Q3yyw3Pg"
  const AUTHORIZATION_EXPIRES_IN_MINUTES = process.env.AUTHORIZATION_EXPIRES_IN_MINUTES ? Number(process.env.AUTHORIZATION_EXPIRES_IN_MINUTES) : 1000
  const BOT_INVITATION_PREFIX = process.env.BOT_INVITATION_PREFIX ?? "t.me/blah-blah?game="

  if (IS_PRODUCTION && !TOKEN_SECRET) {
    throw new Error("Provide TOKEN_SECRET environment variable")
  }

  return {
    port: PORT,
    tokenSecret: TOKEN_SECRET ?? "fallback-secret",
    gameServerUrl: GAME_SERVER_URL,
    iv: GAME_ENCODING_IV,
    key: GAME_ENCODING_KEY,
    userVerificationKey: createHmac("SHA256", "WebAppData").update(BOT_TOKEN).digest(),
    botToken: BOT_TOKEN,
    authorizationExpiresInMinutes: AUTHORIZATION_EXPIRES_IN_MINUTES,
    botInvitationPrefix: BOT_INVITATION_PREFIX,
  }
}