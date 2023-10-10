import { Injectable } from "@nestjs/common"
import { PrismaService } from "./prisma.service"

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  public async getUserByTelegramToken(token: string) {
    // TODO: verify token here and receive telegramId
    const telegramId = token
    return this.prismaService.user.upsert({
      where: {
        telegramId,
      },
      create: {
        telegramId,
      },
      update: {},
    })
  }
}
