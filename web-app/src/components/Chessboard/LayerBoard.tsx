import type { CSSProperties } from "react"
import clsx from "clsx"
import classes from "./Chessboard.module.scss"
import { hexToHsl } from "@/utils/colors"

export type LayerBoardProps = {
  primaryColor: string
}

function LayerBoard({ primaryColor }: LayerBoardProps) {
  const squareColors = generateSquareCssColors(primaryColor)
  const style = {
    "--color-square-white": squareColors.white,
    "--color-square-black": squareColors.black,
  } as CSSProperties

  return (
    <div className={clsx([classes.layer, classes.board])} style={style}>
      <span className={classes["squares-white"]}/>
      <span className={classes["squares-black"]}/>
    </div>
  )
}

function generateSquareCssColors(primaryColor: string) {
  const hue = Math.round(hexToHsl(primaryColor)[0] * 360)
  return {
    white: `hsl(${hue}, 40%, 88%)`,
    black: `hsl(${hue}, 40%, 47%)`,
  }
}

export default LayerBoard
