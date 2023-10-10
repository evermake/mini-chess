const ENV = process.env.ENV
const IS_PRODUCTION = ENV === "production"
const PORT = process.env.PORT ? Number(process.env.PORT) : 4001
const TOKEN_SECRET = process.env.TOKEN_SECRET

if (IS_PRODUCTION && !TOKEN_SECRET) {
  throw new Error("Provide TOKEN_SECRET environment variable")
}

export const config = {
  port: PORT,
  tokenSecret: TOKEN_SECRET ?? "fallback-secret",
}
