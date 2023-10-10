import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"
import { config } from "./config/env"
import { setup } from "./sio/sio"
import { GameService } from "./services/game"
import { GameRepository } from "./repositories/gameRepository"

const server = new Server(config.port, {
  cors: {
    origin: config.corsAllowedOrigin,
  },
})
const gameService = new GameService(
  new GameRepository(
    new PrismaClient(),
  ),
)
setup(server, gameService)
