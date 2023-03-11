import { IsEmail, IsOptional, IsString } from "class-validator";
import { ID, SearchBaseParams } from "src/types/general";

export type UserRole = "client" | "admin" | "manager";

export interface IUser {
  _id: ID;
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
  role?: UserRole;
}

export class SearchUserParams extends SearchBaseParams {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export interface UserSearchParams {
  name?: { $regex: RegExp | string };
  email?: { $regex: RegExp | string };
  contactPhone?: { $regex: RegExp | string };
}

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
  findById(id: ID): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
}
