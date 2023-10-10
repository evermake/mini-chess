import clsx from "clsx"
import type { PieceInfo } from "./types"
import { getSquareClassNames } from "./common"
import classes from "./Chessboard.module.scss"

export type LayerPiecesProps = {
  pieces: PieceInfo[]
}

function LayerPieces({
  pieces,
}: LayerPiecesProps) {
  return (
    <div className={classes.layer}>
      {pieces.map((
        { square, type, color },
        i,
      ) => (
        <span
          key={i}
          className={clsx([
            ...getSquareClassNames(square),
            classes.piece,
            classes[`piece-${color}${type}`],
          ])}
        />
      ))}
    </div>
  )
}

export default LayerPieces
