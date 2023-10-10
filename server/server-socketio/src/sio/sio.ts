import type { Server } from "socket.io"
import type { PlayerData } from "../services/token"
import { TokenService } from "../services/token"
import type { GameService } from "../services/game"
import { EmittedEvents, ReceivedEvents } from "./events"
import { exception } from "./messages"
import { onConnect } from "./handlers/onConnect"
import { createOnDisconnectHandler } from "./handlers/onDisconnect"
import { createOnRequestPauseHandler } from "./handlers/onRequestPause"
import { createOnConfirmPauseHandler } from "./handlers/onConfirmPause"
import { createOnUnpauseHandler } from "./handlers/onUnpause"
import { createOnRequestDrawHandler } from "./handlers/onRequestDraw"
import { createOnConfirmDrawHandler } from "./handlers/onConfirmDraw"
import { createOnRequestLobbyInfo } from "./handlers/onRequestLobbyInfo"
import { createOnRequestSelfInfo } from "./handlers/onRequestSelfInfo"
import { createOnMakeMoveHandler } from "./handlers/onMakeMove"
import { createOnRequestGameState } from "./handlers/onRequestGameState"
import { createOnSurrenderHandler } from "./handlers/onSurrender"

export function setup(server: Server, gameService: GameService) {
  const tokenService = new TokenService()

  server.on("connection", (socket) => {
    let player: PlayerData
    try {
      player = tokenService.verifyPlayer(socket.handshake.headers.authentication!.toString())
    } catch (e) {
      socket.emit(EmittedEvents.exception, exception("Auth token is invalid or missing"))
      socket.disconnect()
      return
    }

    onConnect(server, socket, gameService, player)

    socket.on("disconnect", createOnDisconnectHandler(server, socket, gameService, tokenService, player))
    socket.on(ReceivedEvents.requestPause, createOnRequestPauseHandler(server, gameService, tokenService, player))
    socket.on(ReceivedEvents.confirmPause, createOnConfirmPauseHandler(server, gameService, tokenService, player))
    socket.on(ReceivedEvents.unpause, createOnUnpauseHandler(server, gameService, player))
    socket.on(ReceivedEvents.requestDraw, createOnRequestDrawHandler(server, gameService, tokenService, player))
    socket.on(ReceivedEvents.confirmDraw, createOnConfirmDrawHandler(server, gameService, tokenService, player))
    socket.on(ReceivedEvents.requestGameState, createOnRequestGameState(server, gameService, player))
    socket.on(ReceivedEvents.requestLobbyInfo, createOnRequestLobbyInfo(server, gameService, player))
    socket.on(ReceivedEvents.requestSelfInfo, createOnRequestSelfInfo(server, player))
    socket.on(ReceivedEvents.makeMove, createOnMakeMoveHandler(server, gameService, player))
    socket.on(ReceivedEvents.surrender, createOnSurrenderHandler(server, gameService, player))
  })
}
