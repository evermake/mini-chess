import { useEffect, useRef, useState } from "react"
import { Chess, Color } from "chess.js"
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import type { MoveInfo } from "@/components/Chessboard/types"
import { ApiClient } from "@/api/ApiClient"

type ChessSocket = Socket<ServerToClientEvents, ClientToServerEvents>

function useGame(connectionUrl: string, authToken: string, _apiClient: ApiClient) {
  const socket = useRef<ChessSocket | null>(null)
  const [mySide, setMySide] = useState<Color>("w")
  const [board, setBoard] = useState(() => new Chess())
  const [gameStatus, setGameStatus] = useState<GameStatus>("paused")
  const [timeLeftWhiteMs, setTimeLeftWhiteMs] = useState<number | null>(null)
  const [timeLeftBlackMs, setTimeLeftBlackMs] = useState<number | null>(null)
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null)
  const [needSync, setNeedSync] = useState(true)

  useEffect(() => {
    socket.current = io(connectionUrl, {
      extraHeaders: {
        Authorization: authToken,
      },
    })

    socket.current.on("game_state", (newGameState) => {
      const newBoard = new Chess(newGameState.fen)
      const { clock, status } = gameStateToLocal(newGameState, newBoard)

      setBoard(newBoard)
      setGameStatus(status)
      setTimeLeftWhiteMs(clock?.timeLeftWhiteMs ?? null)
      setTimeLeftBlackMs(clock?.timeLeftBlackMs ?? null)
      setNeedSync(false)
      setLastSyncAt(new Date())
    })

    socket.current.on("self_info", (selfInfo) => {
      setMySide(selfInfo.side === "white" ? "w" : "b")
    })

    return () => {
      socket.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    // Set timeout to sync the game state with the server every 5 seconds.
    const timeoutId = setTimeout(() => {
      socket.current?.emit("request_game_state")
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [lastSyncAt])

  const makeMove = (move: MoveInfo) => {
    board.move(move)
    setNeedSync(true)
    socket.current?.emit("make_move", move)
  }

  return {
    makeMove,
    mySide,
    board,
    gameStatus,
    timeLeftWhiteMs,
    timeLeftBlackMs,
    lastSyncAt,
    needSync,
  }
}

/**
 * Converts a game state from the server's format to a local one.
 *
 * Second argument (`board`) is used to determine the local status of the game.
 * It should be the same as from `fen`, but it's passed in as an argument to
 * avoid creating a new `Chess` instance.
 */
function gameStateToLocal(
  {
    fen,
    status,
    isPaused,
    timeLimitW,
    timeLimitB,
  }: GameState,
  board: Chess,
): LocalGameState {
  const clock = (
    timeLimitW >= 0
    && timeLimitB >= 0
    && timeLimitW < 36000000
    && timeLimitB < 36000000
  )
    ? {
        timeLeftWhiteMs: timeLimitW,
        timeLeftBlackMs: timeLimitB,
      }
    : null

  const getLocalStatus = (): LocalGameState["status"] => {
    if (status === "IN_PROGRESS") {
      return isPaused ? "paused" : "in-progress"
    }

    const sideToMove = board.turn()

    if (status === "DRAW") {
      if (board.isStalemate()) {
        return sideToMove === "w" ? "black-stalemated" : "white-stalemated"
      }
      return "draw"
    }

    if (board.isCheckmate()) {
      return sideToMove === "w" ? "black-checkmated" : "white-checkmated"
    }

    if (sideToMove === "w") {
      return timeLimitW > 0 ? "white-resigned" : "white-timeout"
    } else {
      return timeLimitB > 0 ? "black-resigned" : "black-timeout"
    }
  }

  return {
    fen,
    status: getLocalStatus(),
    clock,
  }
}

type GameState = {
  fen: string
  timeLimitW: number
  timeLimitB: number
  status: "IN_PROGRESS" | "DRAW" | "WHITE" | "BLACK"
  isPaused: boolean
  turn: "white" | "black"
}

type LocalGameState = {
  fen: string
  status: GameStatus
  clock: null | {
    timeLeftWhiteMs: number
    timeLeftBlackMs: number
  }
}

type GameStatus =
  | "not-started"
  | "in-progress"
  | "paused"
  | "white-checkmated"
  | "black-checkmated"
  | "white-stalemated"
  | "black-stalemated"
  | "white-resigned"
  | "black-resigned"
  | "white-timeout"
  | "black-timeout"
  | "draw"

type PlayerInfo = {
  playerId: number
  side: "white" | "black"
}

type LobbyInfo = {
  lobbyId: number
  whiteId: number | null // null indicates that white player has not connected yet.
  blackId: number | null // null indicates that black player has not connected yet.
  timeIncrement: number // In milliseconds
}

type SelfInfo = {
  playerId: number
  side: "white" | "black"
  lobbyId: number
}

type ServerToClientEvents = {
  exception: (args: { message: string }) => void
  game_state: (args: GameState) => void
  game_paused: () => void
  game_unpaused: () => void
  draw_request: (args: { drawOffer: string }) => void
  player_connected: (args: PlayerInfo) => void
  player_disconnected: (args: PlayerInfo) => void
  game_over: (args: { status: "DRAW" | "WHITE" | "BLACK" }) => void
  lobby_info: (args: LobbyInfo) => void
  self_info: (args: SelfInfo) => void
}

type ClientToServerEvents = {
  make_move: (args: MoveInfo) => void
  request_game_state: () => void
  request_lobby_info: () => void
  request_self_info: () => void
  request_draw: () => void
  confirm_draw: (args: { drawOffer: string }) => void
}

export default useGame
