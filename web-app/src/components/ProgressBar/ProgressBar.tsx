import type { CSSProperties } from "react"
import clsx from "clsx"
import classes from "./ProgressBar.module.scss"

export type ProgressBarProps = {
  position: "top" | "bottom"
  color: "primary" | "muted" | "success" | "danger"
  progress?: number
  hidden?: boolean
}

function ProgressBar({
  position,
  color,
  progress,
  hidden,
}: ProgressBarProps) {
  return (
    <span
      className={clsx({
        [classes.bar]: true,
        [classes.hidden]: hidden,
        [classes[`position-${position}`]]: true,
        [classes[`color-${color}`]]: true,
      })}
      style={progress == null
        ? {}
        : {
            "--_progress": `${progress * 100}%`,
          } as CSSProperties}
    />
  )
}

export default ProgressBar
