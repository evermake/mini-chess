import { createContext } from "react"

export type Appearance = "md" | "macos" | "ios"

const AppearanceContext = createContext<Appearance>("md")

export default AppearanceContext
