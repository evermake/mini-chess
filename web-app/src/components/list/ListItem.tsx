import clsx from "clsx"
import type { PropsWithChildren, ReactNode } from "react"
import classes from "./ListItem.module.scss"
import useAppearance from "@/hooks/useAppearance"
import useTheme from "@/hooks/useTheme"

export type ListItemProps = PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements
  leading?: ReactNode
  trailing?: ReactNode
  disabled?: boolean
  className?: string
}>

function ListItem({
  as = "div",
  leading,
  trailing,
  className,
  disabled,
  children,
}: ListItemProps) {
  const Component = as
  const appearance = useAppearance()
  const theme = useTheme()

  return (
    <Component
      className={clsx(
        {
          [classes.dark]: theme.mode === "dark",
          [classes.disabled]: disabled,
        },
        [
          classes.root,
          classes[appearance],
          className,
        ],
      )}
    >
      {leading && (
        <div className={classes.leading}>
          {leading}
        </div>
      )}
      <div className={classes.content}>
        <div className={classes.main}>{children}</div>
        <div className={classes.trailing}>{trailing}</div>
      </div>
    </Component>
  )
}

export default ListItem
