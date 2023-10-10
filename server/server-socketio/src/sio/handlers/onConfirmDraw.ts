import type { Server } from "socket.io"
import { Status } from "@prisma/client"
import type { PlayerData, TokenService } from "../../services/token"
import { toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { gameOver } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnConfirmDrawHandler(
  server: Server,
  gameService: GameService,
  tokenService: TokenService,
  player: PlayerData,
) {
  return handleErrors(server, player, async ({ drawOffer }: { drawOffer: string }) => {
    const game = await gameService.resolveById(player.gameId)
    tokenService.verifyDrawOffer(game.fen, drawOffer)
    await game.draw()
    server.to(toGameRoom(player)).emit(EmittedEvents.gameOver, gameOver(Status.DRAW))
  })
}
