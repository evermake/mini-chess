import type { Server, Socket } from "socket.io"
import type { GameService } from "../../services/game"
import type { PlayerData } from "../../services/token"
import { getGameRoomName, getPlayerRoomName, toGameRoom, toSelf } from "../../utils/utils"
import { EmittedEvents } from "../events"
import { gameState, lobbyInfo, playerConnected, selfInfo } from "../messages"
import { handleErrors } from "./errorHandler"

export async function onConnect(server: Server, socket: Socket, gameService: GameService, player: PlayerData) {
  return handleErrors(server, player, async () => {
    socket.join([getGameRoomName(player.gameId), getPlayerRoomName(player.gameId, player.side)])
    const game = await gameService.resolveById(player.gameId)
    await game.connect(player)

    const connectedGame = await gameService.resolveById(player.gameId)
    const {
      status,
      fen,
      timeLimitW,
      timeLimitB,
      isPaused,
      id: lobbyId,
      whiteId,
      blackId,
      timeIncrement,
    } = connectedGame
    server.to(toGameRoom(player)).emit(EmittedEvents.playerConnected, playerConnected(player))
    server.to(toSelf(player)).emit(EmittedEvents.gameState, gameState({
      status,
      fen,
      timeLimitW,
      timeLimitB,
      isPaused,
      turn: game.getActiveSide(),
    }))
    server.to(toSelf(player)).emit(EmittedEvents.lobbyInfo, lobbyInfo({
      lobbyId,
      whiteId,
      blackId,
      timeIncrement,
    }))
    const { playerId, side } = player
    server.to(toSelf(player)).emit(EmittedEvents.selfInfo, selfInfo({ playerId, side, lobbyId }))
  })()
}
