import { AuthUser, User } from "@im-reading-here/shared";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return null;

      return {
        ...user,
        plan: user.plan as "FREE" | "PREMIUM",
        shelvesVisibleTo: user.shelvesVisibleTo as
          | "public"
          | "club"
          | "private",
      };
    } catch (error) {
      return null;
    }
  }
}
