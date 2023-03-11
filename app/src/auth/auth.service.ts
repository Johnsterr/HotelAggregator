import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcrypt";
import { Request } from "express";
import { IAuthRegisterUser, IAuthService } from "./auth.types";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class AuthService implements IAuthService {
  constructor(private userService: UserService) {}

  async register(data: RegisterDto): Promise<IAuthRegisterUser> {
    const createdUser = await this.userService.create(data);

    return {
      id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    };
  }

  async login(data: LoginDto): Promise<Omit<RegisterDto, "password">> {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email);

    const isValidPassword = await compare(password, user.password);

    if (isValidPassword) {
      return user;
    }

    throw new UnauthorizedException(EXCEPTION_USER_ERRORS.UNAUTHORIZED);
  }

  async logout(req: Request) {
    req.logout((error) => {
      console.log(error);
    });
  }
}

