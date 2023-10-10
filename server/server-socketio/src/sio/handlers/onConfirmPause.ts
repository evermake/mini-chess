import type { Server } from "socket.io"
import type { PlayerData, TokenService } from "../../services/token"
import { toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { handleErrors } from "./errorHandler"

export function createOnConfirmPauseHandler(
  server: Server,
  gameService: GameService,
  tokenService: TokenService,
  player: PlayerData,
) {
  return handleErrors(server, player, async ({ pauseOffer }: { pauseOffer: string }) => {
    const game = await gameService.resolveById(player.gameId)
    tokenService.verifyPauseOffer(game.fen, pauseOffer)
    await game.pause()
    server.to(toGameRoom(player)).emit(EmittedEvents.gamePaused)
  })
}
