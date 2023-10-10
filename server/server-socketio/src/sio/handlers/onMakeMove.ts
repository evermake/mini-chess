import type { Server } from "socket.io"
import { Status } from "@prisma/client"
import type { PlayerData } from "../../services/token"
import { toGameRoom } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { gameOver, gameState } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnMakeMoveHandler(
  server: Server,
  gameService: GameService,
  player: PlayerData,
) {
  return handleErrors(server, player, async (move: { from: string; to: string; promotion?: string }) => {
    const game = await gameService.resolveById(player.gameId)
    const status = await game.makeMove(player.side, move)
    server.to(toGameRoom(player)).emit(EmittedEvents.gameState, gameState({
      ...status,
      turn: game.getActiveSide(),
    }))
    if (game.isPaused) {
      server.to(toGameRoom(player)).emit(EmittedEvents.gameUnpaused)
    }
    if (game.status !== Status.IN_PROGRESS) {
      server.to(toGameRoom(player)).emit(EmittedEvents.gameOver, gameOver(game.status))
    }
  })
}
