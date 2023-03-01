import {
  Controller,
  Post,
  Body,
  Request,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("/auth/login")
  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  )
  login(@Request() req) {
    return req.user;
  }

  @Post("/auth/logout")
  logout() {
    return this.authService.logout();
  }
}

