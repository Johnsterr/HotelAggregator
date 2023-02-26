import { ExceptionFilter } from "@nestjs/common";
import type { UserId } from "src/types/general";

export type UserRole = "client" | "admin" | "manager";

export interface IUser {
  _id?: UserId;
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
  role: string;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser | ExceptionFilter>;
  //findById(id: UserId): Promise<IUser>;
  //findByEmail(email: string): Promise<IUser>;
  //findAll(params: SearchUserParams): Promise<IUser[]>;
}
