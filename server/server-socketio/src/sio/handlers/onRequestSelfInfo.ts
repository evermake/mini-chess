import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toSelf } from "../../utils/utils"
import { EmittedEvents } from "../events"
import { selfInfo } from "../messages"
import { handleErrors } from "./errorHandler"

export function createOnRequestSelfInfo(
  server: Server,
  player: PlayerData,
) {
  return handleErrors(server, player, async () => {
    const { playerId, side, gameId: lobbyId } = player
    server.to(toSelf(player)).emit(EmittedEvents.selfInfo, selfInfo({ playerId, side, lobbyId }))
  })
}
