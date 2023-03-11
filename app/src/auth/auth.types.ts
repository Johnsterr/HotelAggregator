import { Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ID } from "src/types/general";

export interface IAuthRegisterUser {
  id: ID;
  email: string;
  name: string;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<Omit<RegisterDto, "password">>;
  register(dto: RegisterDto): Promise<Omit<RegisterDto, "password">>;
  logout(req: Request): void;
}
