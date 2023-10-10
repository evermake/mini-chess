import { useMemo } from "react"
import clsx from "clsx"
import type { Chess, Color, Square } from "chess.js"
import LayerBoard from "./LayerBoard"
import LayerHighlights from "./LayerHighlights"
import LayerPieces from "./LayerPieces"
import LayerActions from "./LayerActions"
import type { MoveInfo, PieceInfo, SquareHighlight } from "./types"
import classes from "./Chessboard.module.scss"
import useTheme from "@/hooks/useTheme"

export type ChessboardProps = {
  chess: Chess
  side: Color
  selectedPieceSquare?: Square | null
  lastMove?: MoveInfo | null
  onSquareClick?: (square: Square) => void
  onAwayClick?: () => void
  disabled?: boolean
}

function Chessboard({
  chess,
  side,
  selectedPieceSquare,
  lastMove,
  onSquareClick,
  onAwayClick,
  disabled,
}: ChessboardProps) {
  const theme = useTheme()

  const pieces = useMemo((): PieceInfo[] => {
    return chess
      .board()
      .flat()
      .filter((p) => p !== null) as PieceInfo[]
  }, [chess])

  const lastMoveHighlights = useMemo((): SquareHighlight[] => {
    return lastMove
      ? [
          { square: lastMove.from, highlight: "highlight" },
          { square: lastMove.to, highlight: "highlight" },
        ]
      : []
  }, [lastMove])

  const moves = useMemo(() => {
    if (!selectedPieceSquare) {
      return []
    }
    if (chess.turn() !== side) {
      return []
    }
    return chess.moves({ square: selectedPieceSquare, verbose: true })
  }, [chess, selectedPieceSquare, side])

  const moveHighlights = useMemo((): SquareHighlight[] => {
    if (!selectedPieceSquare) {
      return []
    }

    return [
      { square: selectedPieceSquare, highlight: "highlight" },
      ...moves.map((move) => ({
        square: move.to,
        highlight: move.captured ? "capture" : "move",
      } as SquareHighlight)),
    ]
  }, [moves, selectedPieceSquare])

  const moveSquares = useMemo((): Square[] => {
    return moves.map((move) => move.to)
  }, [moves])

  const currentSidePieceSquares = useMemo((): Square[] => {
    return pieces
      .filter((piece) => piece.color === side)
      .map((piece) => piece.square)
  }, [pieces, side])

  return (
    <div
      className={clsx({
        [classes.chessboard]: true,
        [classes.white]: side === "w",
        [classes.black]: side === "b",
        [classes.disabled]: disabled,
      })}
    >
      <LayerBoard primaryColor={theme.colors.link_color}/>
      <LayerHighlights highlights={lastMoveHighlights}/>
      <LayerHighlights highlights={moveHighlights}/>
      <LayerPieces pieces={pieces}/>
      <LayerActions
        clickableSquares={selectedPieceSquare ? moveSquares : currentSidePieceSquares}
        onSquareClick={onSquareClick}
        onAwayClick={onAwayClick}
      />
    </div>
  )
}

export default Chessboard
