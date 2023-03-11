import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.login({ email, password });

    if (user && "email" in user) {
      return user;
    }

    throw new UnauthorizedException(EXCEPTION_USER_ERRORS.NOT_FOUND);
  }
}
