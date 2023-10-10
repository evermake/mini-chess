import { useRef, useState } from "react"
import type { InitialTimeOption, MoveIncrementOption } from "./timeControl"
import { INITIAL_TIME_OPTIONS, MOVE_INCREMENT_OPTIONS } from "./timeControl"
import classes from "./App.module.scss"
import List from "@/components/list/List"
import ListItem from "@/components/list/ListItem"
import MainButton from "@/components/MainButton"
import SideSelect from "@/components/SideSelect/SideSelect"
import Toggle from "@/components/Toggle/Toggle"
import Text from "@/components/Text/Text"
import useAppearance from "@/hooks/useAppearance"
import { ApiClient } from "@/api/ApiClient"

function App() {
  const apiClient = useRef(new ApiClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    authToken: window.Telegram.WebApp.initData,
  }))
  const appearance = useAppearance()
  const [submitting, setSubmitting] = useState(false)
  const [side, setSide] = useState<"white" | "random" | "black">("white")
  const [timeEnabled, setTimeEnabled] = useState(true)
  const [initialTimeMs, setInitialTimeMs] = useState(INITIAL_TIME_OPTIONS["60min"].value)
  const [moveIncrementMs, setMoveIncrementMs] = useState(MOVE_INCREMENT_OPTIONS.disabled.value)

  const handleMainButtonClick = () => {
    if (submitting || !apiClient.current) {
      return
    }
    setSubmitting(true)
    apiClient.current.createGame({
      side,
      timeControl: timeEnabled
        ? {
            initialTimeMs,
            moveIncrementMs,
          }
        : null,
    })
      .then(() => {
        window.Telegram.WebApp.openTelegramLink(import.meta.env.VITE_BOT_LINK)
      })
      .catch(() => {
        window.Telegram.WebApp.showAlert("Failed to create game, try again later.")
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <form aria-disabled={submitting}>
        <List asFieldset title="Choose Your Side">
          <SideSelect
            value={side}
            onChange={setSide}
          />
        </List>

        <List asFieldset title="Time Control">
          <ListItem
            as="label"
            trailing={
              <Toggle
                value={timeEnabled}
                onChange={() => setTimeEnabled((prev) => !prev)}
              />
            }
          >
            <Text>Enable Timer</Text>
          </ListItem>

          <ListItem
            as="label"
            className={classes.selectListItem}
            disabled={!timeEnabled}
            trailing={
              <>
                <select
                  value={initialTimeMs}
                  disabled={!timeEnabled}
                  onChange={(event) => {
                    setInitialTimeMs(Number.parseInt(event.target.value))
                  }}
                >
                  {
                    Object.entries(INITIAL_TIME_OPTIONS).map(([key, { text, value }]) => (
                      <option key={key} value={value}>{text}</option>
                    ))
                  }
                </select>
                <Text
                  color={appearance === "macos" ? "muted" : "primary"}
                >
                  {INITIAL_TIME_OPTIONS[Object.keys(INITIAL_TIME_OPTIONS).find((key) => INITIAL_TIME_OPTIONS[key as InitialTimeOption].value === initialTimeMs)! as InitialTimeOption].text}
                </Text>
              </>
            }
          >
            <Text>Initial Time</Text>
          </ListItem>

          <ListItem
            as="label"
            className={classes.selectListItem}
            disabled={!timeEnabled}
            trailing={
              <>
                <select
                  value={moveIncrementMs}
                  disabled={!timeEnabled}
                  onChange={(event) => {
                    setMoveIncrementMs(Number.parseInt(event.target.value))
                  }}
                >
                  {
                    Object.entries(MOVE_INCREMENT_OPTIONS).map(([key, { text, value }]) => (
                      <option key={key} value={value}>{text}</option>
                    ))
                  }
                </select>
                <Text
                  color={appearance === "macos" ? "muted" : "primary"}
                >
                  {MOVE_INCREMENT_OPTIONS[Object.keys(MOVE_INCREMENT_OPTIONS).find((key) => MOVE_INCREMENT_OPTIONS[key as MoveIncrementOption].value === moveIncrementMs)! as MoveIncrementOption].text}
                </Text>
              </>
            }
          >
            <Text>Move Increment</Text>
          </ListItem>
        </List>
      </form>

      <MainButton
        text={submitting ? "CREATING..." : "CREATE GAME"}
        loading={submitting}
        onClick={handleMainButtonClick}
      />
    </>
  )
}

export default App
