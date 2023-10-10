import type { Chess, PieceSymbol, Square } from "chess.js"

export type PieceInfo = Exclude<ReturnType<Chess["board"]>[number][number], null>
export type MoveInfo = { from: Square; to: Square; promotion?: PieceSymbol }
export type Highlight =
  | "highlight"
  | "move"
  | "capture"
  | "check"
export type SquareHighlight = { square: Square; highlight: Highlight }
