import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { RolesGuard } from "src/guards/roles.guard";
import { NotAuthenticatedGuard } from "src/guards/authentification.guard";
import { RegisterDto } from "src/auth/dto/register.dto";
import { AuthService } from "src/auth/auth.service";

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
}
