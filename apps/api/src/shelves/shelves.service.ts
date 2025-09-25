import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Shelf, ShelfType } from "@im-reading-here/shared";
import { ShelfType as PrismaShelfType } from "@prisma/client";

@Injectable()
export class ShelvesService {
  constructor(private prisma: PrismaService) {}

  async getShelvesForUser(userId: string): Promise<Array<Shelf>> {
    return this.prisma.shelf.findMany({
      where: {
        userId,
      },
    });
  }

  async getShelf(shelfId: string): Promise<Shelf | null> {
    return this.prisma.shelf.findUnique({
      where: { id: shelfId },
    });
  }

  createCustomShelf(userId: string, name: string): Promise<Shelf> {
    return this.prisma.shelf.create({
      data: {
        userId,
        type: PrismaShelfType.CUSTOM,
        name,
      },
    });
  }
}
