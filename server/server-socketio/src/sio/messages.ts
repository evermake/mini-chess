/**
 * This file contains dumb functions to guard types of emitted messages
 */

import type { Status } from "@prisma/client"

export function exception(message: string) {
  return { message }
}

export function pauseRequest(pauseOffer: string) {
  return { pauseOffer }
}

export function drawRequest(drawOffer: string) {
  return { drawOffer }
}

export function playerConnected({ playerId, side }: { playerId: number; side: "white" | "black" }) {
  return { playerId, side }
}

export function playerDisconnected({ playerId, side }: { playerId: number; side: "white" | "black" }) {
  return { playerId, side }
}

export function gameOver(status: Status) {
  return { status }
}

export function gameState(data: {
  fen: string
  timeLimitW: number
  timeLimitB: number
  status: Status
  isPaused: boolean
  turn: "white" | "black"
}) {
  return data
}

export function lobbyInfo(data: {
  lobbyId: number
  whiteId: number | null
  blackId: number | null
  timeIncrement: number
}) {
  return data
}

export function selfInfo(data: {
  playerId: number
  side: "white" | "black"
  lobbyId: number
}) {
  return data
}
