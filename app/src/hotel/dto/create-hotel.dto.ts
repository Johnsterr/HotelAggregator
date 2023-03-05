import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class CreateHotelDto {
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
