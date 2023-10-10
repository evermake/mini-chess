import clsx from "clsx"
import classes from "./SideSelect.module.scss"
import IconKing from "./IconKing"
import IconHalfKing from "./IconHalfKing"
import useTheme from "@/hooks/useTheme"
import useAppearance from "@/hooks/useAppearance"
import Text from "@/components/Text/Text"

export type SideSelectValue = "white" | "black" | "random"

export type SideSelectProps = {
  value: SideSelectValue
  onChange?: (newValue: SideSelectValue) => void
  disabled?: boolean
}

function SideSelect({
  value,
  onChange,
  disabled,
}: SideSelectProps) {
  const theme = useTheme()
  const appearance = useAppearance()
  const whiteColor = "#F4F4F4"
  const blackColor = "#121212"
  const strokeColor = theme.mode === "dark" ? whiteColor : blackColor

  const clickHandler = (value: SideSelectValue) => () => {
    if (!disabled && onChange) {
      onChange(value)
    }
  }

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.disabled]: disabled,
        [classes[appearance]]: true,
        [classes.dark]: theme.mode === "dark",
      })}
    >
      <div
          onClick={clickHandler("white")}
          className={clsx({
            [classes.option]: true,
            [classes.selected]: value === "white",
          })}
        >
          <div className={classes.king}>
            <IconKing
              fillColor={whiteColor}
              strokeColor={strokeColor}
            />
          </div>
          <Text variant="body">White</Text>
        </div>
        <div
          onClick={clickHandler("random")}
          className={clsx({
            [classes.option]: true,
            [classes.selected]: value === "random",
          })}
        >
          <div className={classes.king}>
            <IconHalfKing
              mainColor={whiteColor}
              secondColor={blackColor}
              strokeColor={strokeColor}
            />
          </div>
          <Text variant="body">Random</Text>
        </div>
        <div
          onClick={clickHandler("black")}
          className={clsx({
            [classes.option]: true,
            [classes.selected]: value === "black",
          })}
        >
          <div className={classes.king}>
            <IconKing
              fillColor={blackColor}
              strokeColor={strokeColor}
            />
          </div>
          <Text variant="body">Black</Text>
        </div>
    </div>
  )
}

export default SideSelect
