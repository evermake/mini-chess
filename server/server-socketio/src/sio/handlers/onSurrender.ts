import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { gameOver } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnSurrenderHandler(
  server: Server,
  gameService: GameService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const game = await gameService.resolveById(player.gameId)
    const status = await game.surrender(player.side)
    server.to(toGameRoom(player)).emit(EmittedEvents.gameOver, gameOver(status))
  })
}
