import { Controller, Get, Put, Body, UseGuards, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SupabaseAuthGuard } from "../common/guards/supabase-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import {
  UpdateProfileSchema,
  type UpdateProfileData,
  type AuthUser,
  type SupabaseWebhookPayload,
} from "@im-reading-here/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";

@ApiTags("Authentication")
@Controller("auth")
@UseGuards(SupabaseAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: AuthUser): Promise<AuthUser> {
    return user;
  }

  @Put("profile")
  @ApiOperation({ summary: "Update user profile" })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        avatarUrl: { type: "string", format: "uri" },
        shelvesVisibleTo: {
          type: "string",
          enum: ["public", "club", "private"],
        },
      },
    },
  })
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) data: UpdateProfileData
  ): Promise<AuthUser> {
    return this.authService.updateProfile(user.id, data);
  }

  @Post("sync-user")
  @Public()
  @ApiOperation({ summary: "Sync user from Supabase webhook" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["INSERT", "UPDATE", "DELETE"] },
        table: { type: "string" },
        record: { type: "object" },
        old_record: { type: "object" },
        schema: { type: "string" },
      },
      required: ["type", "table", "schema"],
    },
  })
  async syncUser(
    @Body() webhookData: SupabaseWebhookPayload
  ): Promise<{ success: boolean }> {
    return this.authService.handleSupabaseWebhook(webhookData);
  }
}
