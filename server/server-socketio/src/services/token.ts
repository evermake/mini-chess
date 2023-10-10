import { createHash, createHmac, randomBytes } from "node:crypto"
import { config } from "../config/env"

export type PlayerData = {
  gameId: number
  side: "white" | "black"
  playerId: number
}

enum OfferType {
  draw = "draw",
  pause = "pause",
}

export class TokenService {
  public signPlayer(data: PlayerData): string {
    return this.signData(data)
  }

  public verifyPlayer(data: string): PlayerData {
    return this.verifyData(data) as PlayerData
  }

  public signDrawOffer(fen: string): string {
    return this.signOffer(OfferType.draw, fen)
  }

  public verifyDrawOffer(fen: string, token: string): void {
    return this.verifyOffer(OfferType.draw, fen, token)
  }

  public signPauseOffer(fen: string): string {
    return this.signOffer(OfferType.pause, fen)
  }

  public verifyPauseOffer(fen: string, token: string): void {
    return this.verifyOffer(OfferType.pause, fen, token)
  }

  private signOffer(type: OfferType, fen: string): string {
    return this.signData({
      type,
      fenHash: this.hash(fen),
    })
  }

  private verifyOffer(type: OfferType, fen: string, token: string): void {
    const data = this.verifyData(token)
    if (data.type !== type) {
      throw new Error("Offer type mismatch")
    }
    if (data.fenHash !== this.hash(fen)) {
      throw new Error("Offer has expired")
    }
  }

  private signData(data: Record<string, any>): string {
    const saltedData = `${btoa(JSON.stringify(data))}.${this.createSalt()}`
    return `${saltedData}.${this.createSignature(saltedData)}`
  }

  private verifyData(data: string): Record<string, any> {
    const parts = data.split(".")
    if (parts.length !== 3) {
      throw new Error("Malformed token")
    }

    const signature = this.createSignature(`${parts[0]}.${parts[1]}`)
    if (signature !== parts[2]) {
      throw new Error("Bad signature")
    }

    return JSON.parse(atob(parts[0]))
  }

  private createSalt(): string {
    return randomBytes(16).toString("base64")
  }

  private createSignature(data: string): string {
    return createHmac("SHA256", config.tokenSecret)
      .update(data)
      .digest("base64")
  }

  private hash(data: string): string {
    return createHash("md5")
      .update(data)
      .digest("base64")
  }
}
