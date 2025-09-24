import { Injectable } from "@nestjs/common";
import { ShelfType, Shelf } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

const SHELF_TYPE_MAP = {
  Reading: ShelfType.READING,
  "To Read": ShelfType.TBR,
  Read: ShelfType.READ,
  DNF: ShelfType.DNF,
};

@Injectable()
export class ShelvesService {
  constructor(private prisma: PrismaService) {}

  getShelvesForUser(userId: string) {
    return this.prisma.shelf.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Default shelves are now created automatically by database trigger
   * when a user is inserted. This method is kept for backward compatibility
   * or manual shelf creation if needed.
   */
  async createDefaultShelvesForUser(userId: string) {
    const defaultShelves = Object.entries(SHELF_TYPE_MAP).map(([name, type]) => ({
      userId,
      type,
    }));

    return this.prisma.shelf.createMany({
      data: defaultShelves,
      skipDuplicates: true, // Prevent errors if shelves already exist
    });
  }

  createCustomShelf(userId: string, name: string) {
    return this.prisma.customShelf.create({
      data: {
        userId,
        name,
      },
    });
  }
}
