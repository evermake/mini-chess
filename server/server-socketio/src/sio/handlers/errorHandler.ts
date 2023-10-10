import type { Server } from "socket.io"
import type { PlayerData } from "../../services/token"
import { toSelf } from "../../utils/utils"
import { EmittedEvents } from "../events"
import { exception } from "../messages"

export function handleErrors(server: Server, player: PlayerData, target: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      await target(...args)
    } catch (e) {
      let message = `${e}`
      if (e instanceof Error) {
        message = e.message
      }
      server.to(toSelf(player)).emit(EmittedEvents.exception, exception(message))
    }
  }
}
