import type { MouseEventHandler } from "react"
import clsx from "clsx"
import type { Square } from "chess.js"
import { getSquareClassNames } from "./common"
import classes from "./Chessboard.module.scss"

export type LayerActionsProps = {
  clickableSquares: Square[]
  onSquareClick?: (square: Square) => void
  onAwayClick?: () => void
}

function LayerActions({
  clickableSquares,
  onSquareClick,
  onAwayClick,
}: LayerActionsProps) {
  const handleLayerClick: MouseEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement
    if (target.dataset.square) {
      onSquareClick?.(target.dataset.square as Square)
    } else {
      onAwayClick?.()
    }
  }

  return (
    <div
      className={classes.layer}
      onClick={handleLayerClick}
    >
      {clickableSquares.map((square, i) => (<span
          key={i}
          className={clsx([
            ...getSquareClassNames(square),
            classes.action,
          ])}
          data-square={square}
        />
      ))}
    </div>
  )
}

export default LayerActions
