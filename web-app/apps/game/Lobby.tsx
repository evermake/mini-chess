import { useEffect, useState } from "react"
import type { Square } from "chess.js"
import classes from "./App.module.scss"
import Chessboard from "@/components/Chessboard/Chessboard"
import type { MoveInfo } from "@/components/Chessboard/types"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import User from "@/components/User/User"
import useGame from "@/hooks/useGame"
import { ApiClient } from "@/api/ApiClient"

export type LobbyProps = {
  connectionUrl: string
  authToken: string
  apiClient: ApiClient
}

function Lobby({
  connectionUrl,
  authToken,
  apiClient,
}: LobbyProps) {
  const {
    mySide,
    makeMove,
    board,
    gameStatus,
    timeLeftWhiteMs,
    timeLeftBlackMs,
    needSync,
  } = useGame(connectionUrl, authToken, apiClient)
  const [lastMove, setLastMove] = useState<MoveInfo | null>(null)
  const [selectedPieceSquare, setSelectedPieceSquare] = useState<Square | null>(null)

  function handleSquareClick(square: Square) {
    if (board.turn() !== mySide) {
      return
    }

    if (selectedPieceSquare) {
      const move = {
        from: selectedPieceSquare,
        to: square,
      }
      makeMove(move)
      setLastMove(move)
      setSelectedPieceSquare(null)
    } else {
      setSelectedPieceSquare(square)
    }
  }

  function handleAwayClick() {
    if (selectedPieceSquare) {
      setSelectedPieceSquare(null)
    }
  }

  const opponentTimeLeft = mySide === "w" ? timeLeftBlackMs : timeLeftWhiteMs
  const myTimeLeft = mySide === "w" ? timeLeftWhiteMs : timeLeftBlackMs

  useEffect(() => {
    let gameEndedMessage: null | string = null
    switch (gameStatus) {
      case "white-checkmated":
        gameEndedMessage = "White won"
        break
      case "black-checkmated":
        gameEndedMessage = "Black won"
        break
      case "white-stalemated":
        gameEndedMessage = "Draw — white stalemated"
        break
      case "black-stalemated":
        gameEndedMessage = "Draw — black stalemated"
        break
      case "white-resigned":
        gameEndedMessage = "Black won — white resigned"
        break
      case "black-resigned":
        gameEndedMessage = "White won — black resigned"
        break
      case "white-timeout":
        gameEndedMessage = "Black won — white timeout"
        break
      case "black-timeout":
        gameEndedMessage = "White won — black timeout"
        break
      case "draw":
        gameEndedMessage = "Game ended with a draw"
        break

      case "not-started":
      case "in-progress":
      case "paused":
        break
    }

    if (gameEndedMessage) {
      window.Telegram.WebApp.showPopup({
        message: gameEndedMessage,
        buttons: [
          { type: "default", text: "Check the board" },
          { type: "destructive", text: "Exit" },
        ],
      })
    }
  }, [gameStatus])

  const gameActive = (
    gameStatus === "in-progress"
    || gameStatus === "not-started"
    || gameStatus === "paused"
  )

  return (
    <div className={classes.root}>
      <ProgressBar
        position="top"
        color={mySide !== board.turn() ? "primary" : "muted"}
      />
      <div className={classes.topArea}>
        <User
          name="Opponent"
          description={
            opponentTimeLeft !== null
              ? timeMsToMinuteAndSeconds(opponentTimeLeft)
              : undefined
          }
        />
      </div>
      <div className={classes.gameArea}>
        <Chessboard
          chess={board}
          side={mySide}
          selectedPieceSquare={selectedPieceSquare}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
          onAwayClick={handleAwayClick}
          disabled={needSync || !gameActive}
        />
      </div>
      <div className={classes.bottomArea}>
        <User
          name="You"
          description={
            myTimeLeft !== null
              ? timeMsToMinuteAndSeconds(myTimeLeft)
              : undefined
          }
        />
      </div>
      <ProgressBar
        position="bottom"
        color={mySide === board.turn() ? "primary" : "muted"}
      />
    </div>
  )
}

function timeMsToMinuteAndSeconds(time: number) {
  if (time < 0) {
    time = 0
  }
  const minutes = Math.floor(time / 1000 / 60)
  const seconds = Math.floor(time / 1000) % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export default Lobby
