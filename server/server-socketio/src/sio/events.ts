export enum EmittedEvents {
  exception = "exception",
  pauseRequest = "pause_request",
  gamePaused = "game_paused",
  gameUnpaused = "game_unpaused",
  drawRequest = "draw_request",
  playerConnected = "player_connected",
  playerDisconnected = "player_disconnected",
  gameOver = "game_over",
  gameState = "game_state",
  lobbyInfo = "lobby_info",
  selfInfo = "self_info",
}

export enum ReceivedEvents {
  requestPause = "request_pause",
  confirmPause = "confirm_pause",
  unpause = "unpause",
  requestDraw = "request_draw",
  confirmDraw = "confirm_draw",
  requestGameState = "request_game_state",
  requestLobbyInfo = "request_lobby_info",
  requestSelfInfo = "request_self_info",
  makeMove = "make_move",
  surrender = "surrender",
}
