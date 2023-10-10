import type { PlayerData } from "../services/token"

export function getOppositeSide(side: "white" | "black"): "white" | "black" {
  if (side === "black") {
    return "white"
  }
  return "black"
}

export function getGameRoomName(gameId: number): string {
  return gameId.toString()
}

export function getPlayerRoomName(gameId: number, side: "white" | "black"): string {
  return `${gameId}-${side}`
}

export function toEnemy(player: PlayerData): string {
  return getPlayerRoomName(player.gameId, getOppositeSide(player.side))
}

export function toSelf(player: PlayerData): string {
  return getPlayerRoomName(player.gameId, player.side)
}

export function toGameRoom(player: PlayerData): string {
  return getGameRoomName(player.gameId)
}
