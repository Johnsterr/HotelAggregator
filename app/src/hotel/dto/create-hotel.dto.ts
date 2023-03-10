import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHotelDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
