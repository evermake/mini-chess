import { PrismaClient, Status } from "@prisma/client"
import { Chess } from "chess.js"

async function run() {
  const client = new PrismaClient()
  await client.game.create({
    data: {
      updatedAt: new Date(),
      status: Status.IN_PROGRESS,
      fen: new Chess().fen(),
      isPaused: true,
      timeLimitW: 100000000,
      timeLimitB: 100000000,
      timeIncrement: 0,
    },
  })
}

run()
