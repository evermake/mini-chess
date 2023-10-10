export type ApiClientOptions = {
  baseUrl: string
  authToken: string
}

/**
 * ApiClient is a wrapper around the HTTP API for interacting with the server.
 *
 * Note: this class is not for Socket.IO.
 */
export class ApiClient {
  #baseUrl: string
  #authToken: string

  constructor({ baseUrl, authToken }: ApiClientOptions) {
    this.#baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
    this.#authToken = authToken
  }

  async createGame(params: CreateGameParameters): Promise<void> {
    let response
    try {
      response = await fetch(`${this.#baseUrl}/game`, {
        method: "POST",
        body: JSON.stringify({
          side: params.side.toUpperCase(),
          enableTimer: params.timeControl !== null,
          initialTime: params.timeControl?.initialTimeMs,
          timeIncrement: params.timeControl?.moveIncrementMs,
        }),
        headers: {
          "Authorization": `${this.#authToken}`,
          "Content-Type": "application/json",
        },
      })
    } catch (err) {
      throw new Error(`failed to create game: ${err}`)
    }
    if (!response.ok) {
      throw new Error(`failed to create game: ${response.status}`)
    }
  }

  async getGameConnectionInfo({
    gameHash,
  }: GetGameConnectionInfoParams): Promise<GameConnectionInfo> {
    let response
    try {
      response = await fetch(`${this.#baseUrl}/game/${gameHash}`, {
        method: "GET",
        headers: {
          Authorization: `${this.#authToken}`,
        },
      })
    } catch (err) {
      throw new Error(`failed to get game connection info: ${err}`)
    }
    if (!response.ok) {
      throw new Error(`failed to get game connection info: ${response.status}`)
    }
    const json = await response.json()
    return {
      url: json.gameServerUrl,
      authToken: json.gameServerAuthToken,
    }
  }
}

export type CreateGameParameters = {
  side: "white" | "black" | "random"
  timeControl: null | {
    initialTimeMs: number
    moveIncrementMs: number
  }
}

export type GetGameConnectionInfoParams = {
  gameHash: string
}

export type GameConnectionInfo = {
  url: string
  authToken: string
}
