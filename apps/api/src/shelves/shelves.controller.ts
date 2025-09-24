import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ShelvesService } from "./shelves.service";

@ApiTags("Shelves")
@Controller("shelves")
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Get()
  // @ApiOperation({
  //   summary: "Search for books",
  //   description:
  //     "Search for books using OpenLibrary API. Returns normalized book data with author names, covers, and metadata.",
  // })
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
  async getShelvesForCurrentUser() {
    return {};
  }

  @Get(":shelfId")
  async getShelfById(@Param("shelfId") shelfId: string) {
    return {};
  }
}
