import { IsString, IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class LoginAuthDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}

