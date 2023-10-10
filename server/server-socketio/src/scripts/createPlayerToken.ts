import { TokenService } from "../services/token"

console.log(new TokenService().signPlayer({
  gameId: 1,
  playerId: 8,
  side: "white",
}))
console.log(new TokenService().signPlayer({
  gameId: 1,
  playerId: 9,
  side: "black",
}))
