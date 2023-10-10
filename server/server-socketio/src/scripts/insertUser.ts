import { PrismaClient } from "@prisma/client"

async function run() {
  const client = new PrismaClient()
  await client.user.create({
    data: {
      telegramId: "99999999",
    },
  })
}

run()
