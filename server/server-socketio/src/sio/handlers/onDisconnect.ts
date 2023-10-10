import type { Server, Socket } from "socket.io"
import { Status } from "@prisma/client"
import type { PlayerData, TokenService } from "../../services/token"
import { toEnemy, toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { pauseRequest, playerDisconnected } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnDisconnectHandler(
  server: Server,
  socket: Socket,
  gameService: GameService,
  tokenService: TokenService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const game = await gameService.resolveById(player.gameId)
    if (game.getStatus() === Status.IN_PROGRESS) {
      server.to(toGameRoom(player)).emit(EmittedEvents.playerDisconnected, playerDisconnected(player))
      server.to(toEnemy(player)).emit(EmittedEvents.pauseRequest, pauseRequest(tokenService.signPauseOffer(game.fen)))
    }
    socket.disconnect()
  })
}
