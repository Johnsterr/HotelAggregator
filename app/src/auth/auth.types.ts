import { Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

export interface IAuthService {
  login(dto: LoginDto): Promise<Omit<RegisterDto, "password">>;
  register(dto: RegisterDto): Promise<Omit<RegisterDto, "password">>;
  logout(req: Request): void;
}
