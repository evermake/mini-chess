import { createHmac } from "node:crypto"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "./prisma.service"

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
  }

  public async getUserByTelegramToken(token: string) {
    const user = this.verifyUserData(token)
    return this.prismaService.user.upsert({
      where: {
        telegramId: user.id.toString(),
      },
      create: {
        telegramId: user.id.toString(),
        name: user.last_name ? `${user.first_name} ${user.last_name}` : `${user.first_name}`,
        photoUrl: user.photo_url,
      },
      update: {
        name: user.last_name ? `${user.first_name} ${user.last_name}` : `${user.first_name}`,
        photoUrl: user.photo_url,
      },
    })
  }

  private verifyUserData(token: string): {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
  } {
    const searchParams = new URLSearchParams(token)
    const userObject: Record<string, any> = {}
    for (const [key, value] of searchParams) {
      userObject[key] = value
    }
    const userObjectKeys = Object.keys(userObject).sort()
    let dataCheckString = ""
    for (const key of userObjectKeys) {
      if (key === "hash") {
        continue
      }
      if (dataCheckString !== "") {
        dataCheckString += "\n"
      }
      dataCheckString += `${key}=${userObject[key]}`
    }

    const hash = createHmac("SHA256", this.configService.get("userVerificationKey"))
      .update(dataCheckString)
      .digest("hex")

    if (hash !== userObject.hash) {
      throw new HttpException("Bad authorization token", HttpStatus.UNAUTHORIZED)
    }

    if ((Date.now() / 1000 - Number(userObject.auth_date)) / 60 > this.configService.get("authorizationExpiresInMinutes")) {
      throw new HttpException("Authorization token expired", HttpStatus.UNAUTHORIZED)
    }

    return JSON.parse(userObject.user.toString())
  }
}
