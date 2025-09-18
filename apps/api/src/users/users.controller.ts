import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { SupabaseAuthGuard } from "src/common/guards/supabase-auth.guard";
import { UserDto } from "src/dto/users.dto";
import { ValidationErrorResponseDto } from "src/dto";

@ApiTags("Users")
@Controller("users")
@UseGuards(SupabaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/:id")
  @ApiOperation({
    summary: "Get information for a specific user by ID",
    description: "Fetch user information from the database using the user ID.",
  })
  @ApiParam({
    name: "id",
    description: "The ID of the user to retrieve",
    example: "e9b4a741-a617-474b-907e-75e5500a333b",
  })
  @ApiResponse({
    status: 200,
    description: "User information retrieved successfully",
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid user ID",
    type: ValidationErrorResponseDto,
  })
  async getUser(@Param("id") id: string) {
    return this.usersService.getUserById(id);
  }
}
