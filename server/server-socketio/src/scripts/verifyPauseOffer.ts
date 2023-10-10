import { TokenService } from "../services/token"

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const token = "eyJ0eXBlIjoicGF1c2UiLCJmZW5IYXNoIjoiQUZhWktrSCtlemxBMWN0Q0F1OW9MUT09In0=.llWjGDyuaLY9jwYVNqrHag==.oTRDs/LieO+QCJS1bZUEEmXQGxiDP14uJmyzouMa0gk="

new TokenService().verifyPauseOffer(fen, token)
