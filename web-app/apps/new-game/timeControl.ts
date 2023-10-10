export type InitialTimeOption =
  | "1min"
  | "3min"
  | "5min"
  | "10min"
  | "15min"
  | "30min"
  | "45min"
  | "60min"
  | "90min"
  | "120min"

export type MoveIncrementOption =
  | "disabled"
  | "1sec"
  | "3sec"
  | "5sec"
  | "15sec"
  | "30sec"
  | "1min"

export const INITIAL_TIME_OPTIONS: Record<
  InitialTimeOption,
  { text: string; value: number }
> = {
  "1min": { text: "1 min", value: 1 * 1000 * 60 },
  "3min": { text: "3 min", value: 3 * 1000 * 60 },
  "5min": { text: "5 min", value: 5 * 1000 * 60 },
  "10min": { text: "10 min", value: 10 * 1000 * 60 },
  "15min": { text: "15 min", value: 15 * 1000 * 60 },
  "30min": { text: "30 min", value: 30 * 1000 * 60 },
  "45min": { text: "45 min", value: 45 * 1000 * 60 },
  "60min": { text: "60 min", value: 60 * 1000 * 60 },
  "90min": { text: "90 min", value: 90 * 1000 * 60 },
  "120min": { text: "120 min", value: 120 * 1000 * 60 },
}

export const MOVE_INCREMENT_OPTIONS: Record<
  MoveIncrementOption,
  { text: string; value: number }
> = {
  "disabled": { text: "Disabled", value: 0 },
  "1sec": { text: "1 sec", value: 1 * 1000 },
  "3sec": { text: "3 sec", value: 3 * 1000 },
  "5sec": { text: "5 sec", value: 5 * 1000 },
  "15sec": { text: "15 sec", value: 15 * 1000 },
  "30sec": { text: "30 sec", value: 30 * 1000 },
  "1min": { text: "1 min", value: 1 * 1000 * 60 },
}
