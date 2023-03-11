import { Controller, Post, Body, UseGuards, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { RolesGuard } from "src/guards/roles.guard";
import { NotAuthenticatedGuard } from "src/guards/authentification.guard";
import { RegisterDto } from "src/auth/dto/register.dto";
import { AuthService } from "src/auth/auth.service";
import { Roles } from "src/decorators/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { SearchUserParams } from "./user.types";

@UseGuards(RolesGuard)
@Controller("api")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(NotAuthenticatedGuard)
  @Post("/client/register")
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }

  @Post("/admin/users")
  @Roles("admin")
  async createUser(@Body() body: CreateUserDto) {
    const createdUser = await this.userService.create(body);

    return {
      id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
      contactPhone: createdUser.contactPhone,
      role: createdUser.role,
    };
  }

  @Get("/admin/users")
  @Roles("admin")
  async getUsersByAdmin(@Query() query: SearchUserParams) {
    return await this.userService.findAll(query);
  }

  @Get("/manager/users")
  @Roles("manager")
  async getUsersByManager(@Query() query: SearchUserParams) {
    return await this.userService.findAll(query);
  }
}
