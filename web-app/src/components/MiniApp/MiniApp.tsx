import type { PropsWithChildren } from "react"
import { useEffect, useState } from "react"
import clsx from "clsx"
import classes from "./MiniApp.module.scss"
import AppearanceContext, { type Appearance } from "@/contexts/Appearance"
import ThemeContext, { type Theme } from "@/contexts/Theme"
import getPlatform, { type Platform } from "@/utils/webapp"

export type MiniAppProps = PropsWithChildren<{
  background?: "default" | "secondary"
}>

function MiniApp({
  background = "default",
  children,
}: MiniAppProps) {
  const [theme, setTheme] = useState<Theme>(getTheme)

  useEffect(() => {
    // Event listener that will be called each time when Web App Theme is changed.
    const themeChangeHandler = () => setTheme(getTheme())

    // Register the event listener on the WebApp API.
    window.Telegram.WebApp.onEvent("themeChanged", themeChangeHandler)

    // Cleanup the event listener between effect calls.
    return () => window.Telegram.WebApp.offEvent("themeChanged", themeChangeHandler)
  }, [])

  useEffect(() => {
    if (background === "secondary") {
      document.documentElement.classList.add("bg-secondary")
    } else {
      document.documentElement.classList.remove("bg-secondary")
    }
  }, [background])

  useEffect(() => {
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const platform = getPlatform()
  const appearance = getAppearanceForPlatform(platform)

  return (
    <div
      className={clsx([
        classes.miniApp,
        classes[theme.mode],
        classes[appearance],
      ])}
    >
      <AppearanceContext.Provider value={appearance}>
        <ThemeContext.Provider value={theme}>
          {children}
        </ThemeContext.Provider>
      </AppearanceContext.Provider>
    </div>
  )
}

export function getTheme(): Theme {
  return {
    colors: window.Telegram.WebApp.themeParams,
    mode: window.Telegram.WebApp.colorScheme,
  }
}

export function getAppearanceForPlatform(platform: Platform): Appearance {
  switch (platform) {
    case "macos":
      return "macos"
    case "ios":
      // iOS styling is not implemented yet, so fallback to MacOS.
      return "macos"
    default:
      return "md"
  }
}

export default MiniApp
