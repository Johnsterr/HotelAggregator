import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { ID, SearchBaseParams } from "src/types/general";
import { Reservation } from "./entities/reservation.entity";
import { User } from "src/user/entities/user.entity";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";

export interface IReservation {
  _id: ID;
  user: User;
  hotel: Hotel;
  room: HotelRoom;
  dateStart: Date;
  dateEnd: Date;
}

export class SearchReservationParams extends SearchBaseParams {
  user: ID;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateStart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateEnd?: Date;
}

export interface ISearchReservationParam {
  user: ID;
  dateStart?: { $gte: Date };
  dateEnd?: { $lte: Date };
}

export interface IReservationService {
  addReservation(dto: CreateReservationDto): Promise<Reservation>;
  getReservations(query: SearchReservationParams): Promise<Reservation[]>;
  removeReservation(room: ID, user?: ID): Promise<Reservation>;
}
