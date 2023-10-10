export enum CreateGameSide {
  RANDOM = "RANDOM",
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export class CreateGameDto {
  side: CreateGameSide
  enableTimer: boolean
  initialTime?: number
  timeIncrement?: number
}
