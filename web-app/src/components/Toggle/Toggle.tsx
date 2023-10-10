import clsx from "clsx"
import classes from "./Toggle.module.scss"
import useAppearance from "@/hooks/useAppearance"

export type ToggleProps = {
  value?: boolean
  onChange?: (newValue: boolean) => void
  disabled?: boolean
}

function Toggle({
  value,
  onChange,
  disabled,
}: ToggleProps) {
  const appearance = useAppearance()

  return (
    <div
        className={clsx({
          [classes.root]: true,
          [classes.toggled]: value,
          [classes.disabled]: disabled,
          [classes[appearance]]: true,
        })}
      >
        <input
          type="checkbox"
          role="switch"
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
          checked={value}
        />
        <span className={classes.thumb}></span>
      </div>
  )
}

export default Toggle
