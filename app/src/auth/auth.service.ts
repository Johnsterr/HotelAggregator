import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcrypt";
import { Request } from "express";
import { IAuthService } from "./auth.types";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class AuthService implements IAuthService {
  constructor(private userService: UserService) {}

  async register(data: RegisterDto): Promise<Omit<RegisterDto, "password">> {
    const user = await this.userService.create(data);

    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
  }

  async login(data: LoginDto): Promise<Omit<RegisterDto, "password">> {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email);

    const isValidPassword = await compare(password, user.password);

    if (isValidPassword) {
      return user;
    }

    throw new UnauthorizedException(EXCEPTION_USER_ERRORS.BAD_REQUEST);
  }

  async logout(req: Request) {
    req.logout((error) => {
      console.log(error);
    });
  }
}

