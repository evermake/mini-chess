export type Platform =
  | "unknown"
  | "macos"
  | "linux"
  | "ios"
  | "android"
  | "web"

export default function getPlatform(): Platform {
  switch (window.Telegram.WebApp.platform) {
    case "macos":
      return "macos"
    case "linux":
      return "linux"
    case "ios":
      return "ios"
    case "android":
      return "android"
    case "web":
      return "web"
    default:
      return "unknown"
  }
}
