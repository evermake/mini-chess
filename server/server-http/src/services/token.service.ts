import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto"
import { Buffer } from "node:buffer"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export type PlayerData = {
  gameId: number
  side: "white" | "black"
  playerId: number
}

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public signPlayer(data: PlayerData): string {
    return this.signData(data)
  }

  public encryptGameId(gameId: number): string {
    return this.encryptString(gameId.toString())
  }

  public decryptGameId(data: string): number {
    return Number.parseInt(this.decryptString(data))
  }

  private signData(data: Record<string, any>): string {
    const saltedData = `${btoa(JSON.stringify(data))}.${this.createSalt()}`
    return `${saltedData}.${this.createSignature(saltedData)}`
  }

  private createSalt(): string {
    return randomBytes(16).toString("base64")
  }

  private createSignature(data: string): string {
    return createHmac("SHA256", this.configService.get<string>("tokenSecret"))
      .update(data)
      .digest("base64")
  }

  private encryptString(data: string): string {
    const cipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.configService.get<string>("key"), "hex"),
      Buffer.from(this.configService.get<string>("iv"), "hex"),
    )
    cipher.update(data)
    return cipher.final().toString("hex")
  }

  private decryptString(data: string): string {
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.configService.get<string>("key"), "hex"),
      Buffer.from(this.configService.get<string>("iv"), "hex"),
    )
    decipher.update(Buffer.from(data, "hex"))
    return decipher.final().toString()
  }
}
