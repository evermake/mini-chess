import clsx from "clsx"
import type { SquareHighlight } from "./types"
import classes from "./Chessboard.module.scss"
import { getSquareClassNames } from "./common"

export type LayerHighlightsProps = {
  highlights: SquareHighlight[]
}

function LayerHighlights({
  highlights,
}: LayerHighlightsProps) {
  return (
    <div className={classes.layer}>
      {highlights.map((
        { square, highlight },
        i,
      ) => (
        <span
          key={i}
          className={clsx([
            ...getSquareClassNames(square),
            classes.highlight,
            classes[`highlight-${highlight}`],
          ])}
        />
      ))}
    </div>
  )
}

export default LayerHighlights
