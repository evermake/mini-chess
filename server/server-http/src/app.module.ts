import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MatchmakingModule } from "./matchmaking/matchmaking.module"
import config from "./config"

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MatchmakingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
