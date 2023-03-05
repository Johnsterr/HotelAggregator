import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { Hotel } from "../entities/hotel.entity";

export class CreateHotelRoomDto {
  @IsDefined()
  @IsNotEmpty()
  hotelId: Hotel;

  @IsOptional()
  description: string;
}
