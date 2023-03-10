import { ID } from "src/types/general";

export class CreateHotelRoomDto {
  hotel: ID;
  description?: string;
  images?: string[];
}
