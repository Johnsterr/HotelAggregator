import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  login(user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }

  logout() {
    return `This action returns all auth`;
  }

  async validateUser(loginAuthDto: LoginAuthDto): Promise<Partial<User>> {
    const findedUser: User = await this.userService.findByEmail(
      loginAuthDto.email,
    );
    const comparedPasswordResult = await compare(
      loginAuthDto.password,
      findedUser.password,
    );

    if (findedUser && comparedPasswordResult) {
      const { password, role, ...result } = findedUser;
      return result;
    }

    return null;
  }
}

