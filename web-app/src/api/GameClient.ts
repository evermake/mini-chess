import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"

export type GameClientOptions = {
  socketUrl: string
  authToken: string
}

export class GameClient {
  #socket: Socket

  constructor({ socketUrl, authToken }: GameClientOptions) {
    this.#socket = io(socketUrl, {
      retries: 3,
      timeout: 10000,
      extraHeaders: {
        Authorization: authToken,
      },
      autoConnect: false,
    })
    this.#socket.connect()
  }

  async init() {

  }
}
