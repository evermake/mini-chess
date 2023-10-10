import { useEffect } from "react"

export type MainButtonProps = {
  text: string
  loading?: boolean
  onClick?: () => void
}

/**
 * Non-rendering component that controls the main button in the Telegram UI.
 */
function MainButton({
  text,
  loading,
  onClick,
}: MainButtonProps) {
  useEffect(() => {
    window.Telegram.WebApp.MainButton.setText(text.toUpperCase())
  }, [text])

  useEffect(() => {
    if (loading) {
      window.Telegram.WebApp.MainButton.showProgress().disable()
    } else {
      window.Telegram.WebApp.MainButton.hideProgress().enable()
    }
  }, [loading])

  useEffect(() => {
    if (onClick) {
      window.Telegram.WebApp.MainButton.onClick(onClick)
      return () => {
        window.Telegram.WebApp.MainButton.offClick(onClick)
      }
    }
  }, [onClick])

  useEffect(() => {
    window.Telegram.WebApp.MainButton.show()
    return () => {
      window.Telegram.WebApp.MainButton.hide()
    }
  }, [])

  return null
}

export default MainButton
