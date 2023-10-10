import type { ReactNode } from "react"
import clsx from "clsx"
import classes from "./List.module.scss"
import Text from "@/components/Text/Text"
import useAppearance from "@/hooks/useAppearance"

export type ListProps = React.PropsWithChildren<{
  title?: string
  footer?: ReactNode
  asFieldset?: boolean
}>

function List({
  title,
  footer,
  asFieldset = false,
  children,
}: ListProps) {
  const RootComponent = asFieldset ? "fieldset" : "div"
  const appearance = useAppearance()

  // List structure depends on the appearance, therefore we need to
  // use different components for different appearances.
  if (appearance === "macos") {
    return (
      <RootComponent
        className={clsx([
          classes.root,
          classes[appearance],
        ])}
      >
        {title && (
          <Text
            as={asFieldset ? "legend" : "h3"}
            variant="list-title"
            color="muted"
            className={classes.title}
          >
            {title}
          </Text>
        )}
        <div className={classes.paper}>
          <div className={classes.body}>
            {children}
          </div>
        </div>
        {footer && (
          <Text
            as="p"
            variant="caption"
            color="muted"
            className={classes.footer}
          >
            {footer}
          </Text>
        )}
      </RootComponent>
    )
  } else {
    return (
      <RootComponent
        className={clsx([
          classes.root,
          classes[appearance],
        ])}
      >
        <div className={classes.paper}>
          {title && (
            <Text
              as={asFieldset ? "legend" : "h3"}
              variant="list-title"
              color="primary"
              className={classes.title}
            >
              {title}
            </Text>
          )}
          <div className={classes.body}>
            {children}
          </div>
        </div>
        {footer && (
          <Text
            as="p"
            variant="caption"
            color="muted"
            className={classes.footer}
          >
            {footer}
          </Text>
        )}
      </RootComponent>
    )
  }
}

export default List
