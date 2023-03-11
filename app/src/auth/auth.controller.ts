import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import {
  AuthenticatedGuard,
  LoginGuard,
} from "src/guards/authentification.guard";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post("login")
  @UseGuards(LoginGuard)
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    const { email, name, contactPhone } = user;
    return { email, name, contactPhone };
  }

  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  @Post("logout")
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }
}

