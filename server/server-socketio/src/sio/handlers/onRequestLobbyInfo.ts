import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toSelf } from "../../utils/utils"
import { EmittedEvents } from "../events"
import type { GameService } from "../../services/game"
import { lobbyInfo } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnRequestLobbyInfo(
  server: Server,
  gameService: GameService,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const { id: lobbyId, whiteId, blackId, timeIncrement } = await gameService.resolveById(player.gameId)
    server.to(toSelf(player)).emit(EmittedEvents.lobbyInfo, lobbyInfo({ lobbyId, whiteId, blackId, timeIncrement }))
  })
}
