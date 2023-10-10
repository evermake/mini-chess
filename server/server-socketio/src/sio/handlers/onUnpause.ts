import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { handleErrors } from "./errorHandler"

export function createOnUnpauseHandler(
  server: Server,
  gameService: GameService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const game = await gameService.resolveById(player.gameId)
    await game.unpause()
    server.to(toGameRoom(player)).emit(EmittedEvents.gameUnpaused)
  })
}
