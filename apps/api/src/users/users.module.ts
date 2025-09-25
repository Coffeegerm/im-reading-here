import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ShelvesService } from "src/shelves/shelves.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, ShelvesService],
})
export class UsersModule {}
