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

  createDefaultShelvesForUser(userId: string) {
    const defaultShelves = Object.keys(SHELF_TYPE_MAP).map((name) => ({
      name,
      userId,
      type: SHELF_TYPE_MAP[name],
    }));

    this.prisma.shelf.createMany({
      data: defaultShelves,
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
