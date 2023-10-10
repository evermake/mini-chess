import type { PropsWithChildren } from "react"
import clsx from "clsx"
import classes from "./Text.module.scss"
import useAppearance from "@/hooks/useAppearance"

export type TextProps = PropsWithChildren<{
  color?: "inherit" | "text" | "muted" | "primary" | "danger" | "success"
  variant?: "body" | "list-title" | "caption" | "title" | "subtitle"
  as?: keyof JSX.IntrinsicElements
  selectable?: boolean
  className?: string
}>

function Text({
  color = "inherit",
  variant = "body",
  as: RootComponent = "span",
  selectable,
  className,
  children,
}: TextProps) {
  const appearance = useAppearance()

  return (
    <RootComponent
      className={clsx(
        {
          [classes.selectable]: selectable,
        },
        [
          classes.text,
          classes[appearance],
          classes[`variant-${variant}`],
          classes[`color-${color}`],
          className,
        ],
      )}
    >
      {children}
    </RootComponent>
  )
}

export default Text
