import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common"
import { MatchmakingService } from "./matchmaking.service"
import { CreateGameDto } from "./dto/createGame.dto"
import { GameDto } from "./dto/game.dto"
import { InviteHashDto } from "./dto/inviteHash.dto"
import { UserDto } from "./dto/user.dto"

@Controller()
export class MatchmakingController {
  constructor(
    private readonly matchmakingService: MatchmakingService,
  ) {
  }

  @Post("/game")
  async createGame(
    @Headers("authorization") auth: string,
    @Body() data: CreateGameDto,
  ): Promise<InviteHashDto> {
    return this.matchmakingService.createGame(auth, data)
  }

  @Get("/game/:gameHash")
  async connectToGame(
    @Headers("authorization") auth: string,
    @Param("gameHash") gameHash: string,
  ): Promise<GameDto> {
    return this.matchmakingService.connectToGame(auth, gameHash)
  }

  @Get("user/:userId")
  async getUser(
    @Param("userId") userId: string,
  ): Promise<UserDto> {
    return this.matchmakingService.getUser(userId)
  }
}
