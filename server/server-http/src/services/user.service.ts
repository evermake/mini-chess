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

  public async getUserByTelegramInitData(initData: string) {
    const user = this.verifyInitData(initData)
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

  private verifyInitData(initData: string): {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
  } {
    const initDataObject = this.parseQuery(initData)
    const dataCheckString = this.getDataCheckString(initDataObject)

    const hash = createHmac("SHA256", this.configService.get("userVerificationKey"))
      .update(dataCheckString)
      .digest("hex")

    if (hash !== initDataObject.hash) {
      throw new HttpException("Bad authorization token", HttpStatus.UNAUTHORIZED)
    }

    if ((Date.now() / 1000 - Number(initDataObject.auth_date)) / 60 > this.configService.get("authorizationExpiresInMinutes")) {
      throw new HttpException("Authorization token expired", HttpStatus.UNAUTHORIZED)
    }

    return JSON.parse(initDataObject.user.toString())
  }

  private getDataCheckString(initDataObject: Record<string, any>) {
    const userObjectKeys = Object.keys(initDataObject).sort()
    let dataCheckString = ""
    for (const key of userObjectKeys) {
      if (key === "hash") {
        continue
      }
      if (dataCheckString !== "") {
        dataCheckString += "\n"
      }
      dataCheckString += `${key}=${initDataObject[key]}`
    }
    return dataCheckString
  }

  private parseQuery(query: string): Record<string, any> {
    const searchParams = new URLSearchParams(query)
    const object: Record<string, any> = {}
    for (const [key, value] of searchParams) {
      object[key] = value
    }
    return object
  }
}
