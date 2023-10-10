import { useEffect, useState } from "react"
import Lobby from "./Lobby"
import Text from "@/components/Text/Text"
import { ApiClient, GameConnectionInfo } from "@/api/ApiClient"

function App() {
  const [apiClient, _] = useState(() => new ApiClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    authToken: window.Telegram.WebApp.initData,
  }))
  const [gameHash, setGameHash] = useState<string | null>(null)
  const [connectionInfo, setConnectionInfo] = useState<GameConnectionInfo | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tgWebAppStartParam = urlParams.get("tgWebAppStartParam")
    if (!tgWebAppStartParam) {
      window.Telegram.WebApp.showAlert("Invalid link opened.", () => {
        window.Telegram.WebApp.close()
      })
      return
    }
    setGameHash(tgWebAppStartParam)
  }, [])

  useEffect(() => {
    if (!gameHash) {
      return
    }

    if (connectionInfo) {
      return
    }

    apiClient
      .getGameConnectionInfo({ gameHash })
      .then((info) => {
        setConnectionInfo(info)
      })
      .catch(() => {
        window.Telegram.WebApp.showAlert(
          "Failed to connect, try again later.",
          () => {
            window.Telegram.WebApp.close()
          },
        )
      })
  }, [gameHash])

  if (!connectionInfo) {
    return (
      <Text>Connecting...</Text>
    )
  }

  return (
    <Lobby
      connectionUrl={connectionInfo.url}
      authToken={connectionInfo.authToken}
      apiClient={apiClient}
    />
  )
}

export default App
