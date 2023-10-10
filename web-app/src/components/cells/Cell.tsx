import React from "react"
import classes from "./Cell.module.scss"

export type CellProps = React.PropsWithChildren<{
  leading?: React.ReactNode
  trailing?: React.ReactNode
}>

function Cell({
  leading,
  trailing,
  children,
}: CellProps) {
  return (
    <div className={classes.root}>
      {leading && <div className={classes.leading}>{leading}</div>}
      <div className={classes.content}>
        <div>
          {children}
        </div>
        {trailing && <div>{trailing}</div>}
      </div>
    </div>
  )
}

export default Cell
