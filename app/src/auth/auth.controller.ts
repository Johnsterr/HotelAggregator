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
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
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

