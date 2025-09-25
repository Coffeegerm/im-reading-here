import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "@im-reading-here/shared";
import { ShelvesService } from "./shelves.service";
import { SupabaseAuthGuard } from "src/common/guards/supabase-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@ApiTags("Shelves")
@Controller("shelves")
@UseGuards(SupabaseAuthGuard)
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Get()
  @ApiOperation({
    summary: "Search for books",
    description:
      "Search for books using OpenLibrary API. Returns normalized book data with author names, covers, and metadata.",
  })
  // @ApiQuery({
  //   name: "q",
  //   description: "Search query (book title, author, ISBN, etc.)",
  //   example: "lord of the rings tolkien",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "List of books matching the search query",
  //   type: [NormalizedBookHitDto],
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: "Invalid search query",
  //   type: ValidationErrorResponseDto,
  // })
  async getShelvesForCurrentUser(@CurrentUser() user: AuthUser) {
    return this.shelvesService.getShelvesForUser(user.id);
  }

  @Get(":shelfId")
  async getShelfById(@Param("shelfId") shelfId: string) {
    return {};
  }
}
