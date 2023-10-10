import type { Server } from "socket.io"
import { Status } from "@prisma/client"
import type { PlayerData, TokenService } from "../../services/token"
import { toEnemy } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { pauseRequest } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnRequestPauseHandler(
  server: Server,
  gameService: GameService,
  tokenService: TokenService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const game = await gameService.resolveById(player.gameId)
    if (game.getStatus() !== Status.IN_PROGRESS) {
      server.to(toEnemy(player)).emit(EmittedEvents.pauseRequest, pauseRequest(tokenService.signPauseOffer(game.fen)))
    } else {
      throw new Error("The game is over")
    }
  })
}
