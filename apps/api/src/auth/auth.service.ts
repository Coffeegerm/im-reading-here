import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  createSupabaseAdminClient,
  type SupabaseConfig,
  type AuthUser,
  type UpdateProfileData,
  type SupabaseUser,
  type SupabaseWebhookPayload,
} from "@im-reading-here/shared";

@Injectable()
export class AuthService {
  private supabaseAdmin;

  constructor(private prisma: PrismaService) {
    const config: SupabaseConfig = {
      url: process.env.SUPABASE_URL || "",
      anonKey: process.env.SUPABASE_ANON_KEY || "",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    };

    // Determine auth mode based on available configuration
    if (!config.url) {
      console.warn(
        "Supabase URL not configured - using mock auth service for development"
      );
      this.supabaseAdmin = null;
    } else if (!config.serviceRoleKey) {
      console.warn(
        "Supabase service role key not configured - limited auth functionality"
      );
      this.supabaseAdmin = null;
    } else {
      console.log("Supabase configured - using full auth service");
      this.supabaseAdmin = createSupabaseAdminClient(config);
    }
  }

  async validateUser(token: string): Promise<AuthUser | null> {
    try {
      if (!this.supabaseAdmin) {
        // Development mode - return mock user
        return this.getMockUser();
      }

      const {
        data: { user },
        error,
      } = await this.supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException("Invalid token");
      }

      // Sync user data with our database
      const dbUser = await this.syncUserWithDatabase(user);
      return dbUser;
    } catch (error) {
      console.error("Auth validation error:", error);
      return null;
    }
  }

  private async syncUserWithDatabase(
    supabaseUser: SupabaseUser
  ): Promise<AuthUser> {
    const user = await this.prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email,
        updatedAt: new Date(),
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name:
          supabaseUser.user_metadata?.name || supabaseUser.email.split("@")[0],
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
        plan: "FREE",
        shelvesVisibleTo: "club",
      },
    });

    return {
      ...user,
      plan: user.plan as "FREE" | "PREMIUM",
      shelvesVisibleTo: user.shelvesVisibleTo as "public" | "club" | "private",
    };
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<AuthUser> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return {
        ...user,
        plan: user.plan as "FREE" | "PREMIUM",
        shelvesVisibleTo: user.shelvesVisibleTo as
          | "public"
          | "club"
          | "private",
      };
    } catch (error) {
      throw new BadRequestException("Failed to update profile");
    }
  }

  async handleSupabaseWebhook(
    payload: SupabaseWebhookPayload
  ): Promise<{ success: boolean }> {
    try {
      if (
        payload.type === "INSERT" &&
        payload.table === "users" &&
        payload.record
      ) {
        await this.syncUserWithDatabase(payload.record);
      }

      return { success: true };
    } catch (error) {
      console.error("Webhook error:", error);
      return { success: false };
    }
  }

  // Mock user for development
  private getMockUser(): AuthUser {
    return {
      id: "dev-user-id",
      email: "dev@example.com",
      name: "Development User",
      avatarUrl: null,
      plan: "FREE",
      shelvesVisibleTo: "club",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
