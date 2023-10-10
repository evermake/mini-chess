import type { Square } from "chess.js"
import classes from "./Chessboard.module.scss"

export function getSquareClassNames(square: Square): string[] {
  return [
    classes.square,
    classes[`square-${square[0]}`],
    classes[`square-${square[1]}`],
  ]
}
