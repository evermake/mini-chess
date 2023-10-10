import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Status } from "@prisma/client"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "../services/prisma.service"
import { UserService } from "../services/user.service"
import { TokenService } from "../services/token.service"
import { TelegramService } from "../services/telegram.service"
import { CreateGameDto, CreateGameSide } from "./dto/createGame.dto"
import { GameDto } from "./dto/game.dto"
import { InviteHashDto } from "./dto/inviteHash.dto"
import { UserDto } from "./dto/user.dto"

@Injectable()
export class MatchmakingService {
  private readonly telegramService: TelegramService

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    this.telegramService = TelegramService.Instance
  }

  async createGame(auth: string, data: CreateGameDto): Promise<InviteHashDto> {
    const user = await this.userService.getUserByTelegramToken(auth)

    if (!data.enableTimer) {
      // TODO
      throw new HttpException("Creation of a game without timer is unimplemented yet", HttpStatus.NOT_IMPLEMENTED)
    }

    if (data.enableTimer && (!data.initialTime || !data.timeIncrement)) {
      throw new HttpException("Provide initialTime and timeIncrement", HttpStatus.BAD_REQUEST)
    }

    const sideObject: { whiteId?: number; blackId?: number } = {}
    if (data.side === CreateGameSide.WHITE) {
      sideObject.whiteId = user.id
    } else if (data.side === CreateGameSide.BLACK) {
      sideObject.blackId = user.id
    } else {
      if (Math.random() > 0.5) {
        sideObject.whiteId = user.id
      } else {
        sideObject.blackId = user.id
      }
    }

    const game = await this.prismaService.game.create({
      data: {
        ...sideObject,
        updatedAt: new Date(),
        status: Status.IN_PROGRESS,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        isPaused: true,
        timeLimitB: data.initialTime,
        timeLimitW: data.initialTime,
        timeIncrement: data.timeIncrement,
      },
    })

    const gameHash = this.tokenService.encryptGameId(game.id)

    this.telegramService.sendMessage(Number.parseInt(user.telegramId), `${this.configService.get("botInvitationPrefix")}${gameHash}`)

    return {
      hash: gameHash,
    }
  }

  async connectToGame(auth: string, gameHash: string): Promise<GameDto> {
    const gameId = this.tokenService.decryptGameId(gameHash)
    const game = await this.prismaService.game.findFirst({
      where: {
        id: gameId,
        status: Status.IN_PROGRESS,
      },
    })

    if (!game) {
      throw new HttpException("Bad or expired invite link", HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.getUserByTelegramToken(auth)
    if (user.id === game.whiteId || user.id === game.blackId) {
      return {
        gameServerUrl: this.configService.get<string>("gameServerUrl"),
        gameServerAuthToken: this.tokenService.signPlayer({
          playerId: user.id,
          side: user.id === game.whiteId ? "white" : "black",
          gameId: game.id,
        }),
      }
    }

    if (game.whiteId !== null && game.blackId !== null) {
      throw new HttpException("This lobby is full", HttpStatus.BAD_REQUEST)
    }

    const sideObject: { whiteId?: number; blackId?: number } = {}
    if (game.whiteId) {
      sideObject.blackId = user.id
    } else {
      sideObject.whiteId = user.id
    }

    await this.prismaService.game.update({
      where: {
        id: gameId,
      },
      data: {
        ...sideObject,
      },
    })

    return {
      gameServerUrl: this.configService.get<string>("gameServerUrl"),
      gameServerAuthToken: this.tokenService.signPlayer({
        playerId: user.id,
        side: sideObject.whiteId ? "white" : "black",
        gameId: game.id,
      }),
    }
  }

  async getUser(userIdString: string): Promise<UserDto> {
    const userId = Number.parseInt(userIdString)
    if (userId.toString() !== userIdString) {
      throw new HttpException("UserId must be integer", HttpStatus.BAD_REQUEST)
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    return {
      name: user.name,
      photoUrl: user.photoUrl,
    }
  }
}
