import { createContext } from "react"
import type { ThemeParams } from "@/web-app"

export type Theme = {
  colors: ThemeParams
  mode: "light" | "dark"
}

const ThemeContext = createContext({
  colors: window.Telegram.WebApp.themeParams,
  mode: window.Telegram.WebApp.colorScheme,
})

export default ThemeContext
