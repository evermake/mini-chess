import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toGameRoom, toSelf } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { gameOver, gameState } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnRequestGameState(
  server: Server,
  gameService: GameService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const game = await gameService.resolveById(player.gameId)
    const state = await game.checkTimeoutsAndGetState()
    server.to(toSelf(player)).emit(EmittedEvents.gameState, gameState({
      ...state,
      turn: game.getActiveSide(),
    }))
    if (game.status !== state.status) {
      server.to(toGameRoom(player)).emit(EmittedEvents.gameOver, gameOver(state.status))
    }
  })
}
