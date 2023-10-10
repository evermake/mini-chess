import { Module } from "@nestjs/common"
import { PrismaService } from "../services/prisma.service"
import { UserService } from "../services/user.service"
import { TokenService } from "../services/token.service"
import { MatchmakingService } from "./matchmaking.service"
import { MatchmakingController } from "./matchmaking.controller"

@Module({
  imports: [],
  controllers: [MatchmakingController],
  providers: [MatchmakingService, UserService, PrismaService, TokenService],
})
export class MatchmakingModule {
}
