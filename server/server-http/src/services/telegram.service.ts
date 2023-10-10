import { Bot } from "grammy"
import config from "../config"

export class TelegramService {
  private static _instance: TelegramService
  private readonly bot: Bot

  private constructor() {
    this.bot = new Bot(config().botToken)
    this.bot.command("start", (ctx) => ctx.reply("Hey hey"))

    this.bot.start()
  }

  public async sendMessage(telegramId: number, message: string) {
    return this.bot.api.sendMessage(telegramId, message)
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }
}
