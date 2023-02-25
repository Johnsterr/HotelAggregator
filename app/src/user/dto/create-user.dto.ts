import {
  IsString,
  IsDefined,
  IsOptional,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactPhone: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  role: string;
}
