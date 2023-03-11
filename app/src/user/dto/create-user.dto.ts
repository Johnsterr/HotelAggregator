import {
  IsString,
  IsDefined,
  IsOptional,
  IsEmail,
  IsNotEmpty,
} from "class-validator";
import { UserRole } from "../user.types";

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  role?: UserRole;
}
