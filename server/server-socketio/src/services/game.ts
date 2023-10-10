import { Status } from "@prisma/client"
import { Chess } from "chess.js"
import type { GameRepository } from "../repositories/gameRepository"
import type { PlayerData } from "./token"

export class GameService {
  constructor(
    private readonly repository: GameRepository,
  ) {
  }

  public async resolveById(id: number): Promise<GameState> {
    const gameData = await this.repository.resolveById(id)
    return GameState.FromGameData(gameData, this.repository)
  }
}

type GameStatus = {
  fen: string
  timeLimitW: number
  timeLimitB: number
  status: Status
  isPaused: boolean
}

class GameState {
  private readonly chess: Chess

  constructor(
    public readonly id: number,
    public readonly whiteId: number | null,
    public readonly blackId: number | null,
    public readonly updatedAt: Date,
    public readonly status: Status,
    public readonly fen: string,
    public readonly isPaused: boolean,
    public readonly timeLimitW: number,
    public readonly timeLimitB: number,
    public readonly timeIncrement: number,
    private readonly repository: GameRepository,
  ) {
    this.chess = new Chess(this.fen)
  }

  public static FromGameData(data: Awaited<ReturnType<GameRepository["resolveById"]>>, repository: GameRepository): GameState {
    return new GameState(
      data.id,
      data.whiteId,
      data.blackId,
      data.updatedAt,
      data.status,
      data.fen,
      data.isPaused,
      data.timeLimitW,
      data.timeLimitB,
      data.timeIncrement,
      repository,
    )
  }

  public async connect(player: PlayerData) {
    if (player.side === "white" && this.whiteId === null) {
      return this.repository.updateWithId(this.id, {
        whiteId: player.playerId,
      })
    }

    if (player.side === "black" && this.blackId === null) {
      return this.repository.updateWithId(this.id, {
        blackId: player.playerId,
      })
    }
  }

  public async makeMove(playerSide: "black" | "white", move: {
    from: string
    to: string
    promotion?: string
  }): Promise<GameStatus> {
    await this.verifyGameIsInProgress()
    if (playerSide !== this.getActiveSide()) {
      throw new Error("This is not your turn")
    }
    this.chess.move(move)
    let status: Status = Status.IN_PROGRESS
    if (this.chess.isGameOver()) {
      if (this.chess.isDraw()) {
        status = Status.DRAW
      } else {
        if (playerSide === "white") {
          status = Status.WHITE
        } else {
          status = Status.BLACK
        }
      }
    }

    const timeEntities = this.getUpdatedTimeEntities()
    await this.repository.updateWithId(this.id, {
      status,
      fen: this.chess.fen(),
      ...timeEntities,
      isPaused: false,
    })

    return {
      timeLimitW: timeEntities.timeLimitW,
      timeLimitB: timeEntities.timeLimitB,
      fen: this.chess.fen(),
      status,
      isPaused: false,
    }
  }

  public async pause() {
    await this.verifyGameIsInProgress()
    if (this.isPaused) {
      throw new Error("The game is already on pause")
    }
    return this.repository.updateWithId(this.id, {
      isPaused: true,
      ...this.getUpdatedTimeEntities(),
    })
  }

  public async unpause() {
    await this.verifyGameIsInProgress()
    if (!this.isPaused) {
      throw new Error("The game is not on pause")
    }
    if (this.whiteId === null || this.blackId === null) {
      throw new Error("Can not unpause a game that has not yet started")
    }
    return this.repository.updateWithId(this.id, {
      isPaused: false,
      ...this.getUpdatedTimeEntities(),
    })
  }

  public async draw() {
    await this.verifyGameIsInProgress()
    return this.repository.updateWithId(this.id, {
      status: Status.DRAW,
    })
  }

  public async surrender(side: "white" | "black"): Promise<Status> {
    await this.verifyGameIsInProgress()
    const status = side === "white" ? Status.BLACK : Status.WHITE
    await this.repository.updateWithId(this.id, {
      status,
    })
    return status
  }

  public getActiveSide(): "white" | "black" {
    if (this.chess.turn() === "w") {
      return "white"
    }
    return "black"
  }

  public async checkTimeoutsAndGetState(): Promise<GameStatus> {
    const status = this.getStatus()
    const timeEntities = this.getUpdatedTimeEntities()
    if (this.status === Status.IN_PROGRESS && this.status !== status) {
      await this.repository.updateWithId(this.id, {
        status,
        ...timeEntities,
      })
    }

    return {
      fen: this.fen,
      timeLimitW: timeEntities.timeLimitW,
      timeLimitB: timeEntities.timeLimitB,
      status,
      isPaused: this.isPaused,
    }
  }

  public getStatus(): Status {
    if (this.status !== Status.IN_PROGRESS) {
      return this.status
    }

    const { timeLimitW, timeLimitB } = this.getUpdatedTimeEntities()
    if (timeLimitW <= 0) {
      return Status.BLACK
    }
    if (timeLimitB <= 0) {
      return Status.WHITE
    }
    return Status.IN_PROGRESS
  }

  private async verifyGameIsInProgress() {
    const status = this.getStatus()
    if (this.status === Status.IN_PROGRESS && status !== this.status) {
      await this.repository.updateWithId(this.id, {
        status,
        ...this.getUpdatedTimeEntities(),
      })
    }

    if (status !== Status.IN_PROGRESS) {
      throw new Error("This game is over")
    }
  }

  private getUpdatedTimeEntities(): ({ timeLimitW: number; timeLimitB: number; updatedAt: Date }) {
    if (this.isPaused) {
      return {
        timeLimitW: this.timeLimitW,
        timeLimitB: this.timeLimitB,
        updatedAt: new Date(),
      }
    }

    const timeLimitW = this.timeLimitW - (this.getActiveSide() === "white" ? (Date.now() - this.updatedAt.getTime()) : 0)
    const timeLimitB = this.timeLimitB - (this.getActiveSide() === "black" ? (Date.now() - this.updatedAt.getTime()) : 0)

    return {
      timeLimitW,
      timeLimitB,
      updatedAt: new Date(),
    }
  }
}
