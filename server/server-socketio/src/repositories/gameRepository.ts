import type { PrismaClient } from "@prisma/client"

export class GameRepository {
  constructor(
    private readonly prisma: PrismaClient,
  ) {
  }

  public async resolveById(id: number) {
    return this.prisma.game.findFirstOrThrow({
      where: { id },
    })
  }

  public async updateWithId(id: number, data: Partial<Awaited<ReturnType<GameRepository["resolveById"]>>>) {
    return this.prisma.game.update({
      where: { id },
      data,
    })
  }
}
