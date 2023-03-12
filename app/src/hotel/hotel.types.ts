import { IsOptional, IsString } from "class-validator";
import { ID, SearchBaseParams } from "src/types/general";
import { Hotel } from "./entities/hotel.entity";
import { HotelRoom } from "./entities/hotel-room.entity";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";

export interface IHotel {
  _id: ID;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SearchHotelParams extends SearchBaseParams {
  @IsOptional()
  @IsString()
  title?: string;
}

interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface ICreateHotel {
  id: ID;
  title: string;
  description: string;
}

export interface IUpdateHotel {
  id: ID;
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: Partial<Hotel>): Promise<ICreateHotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<IUpdateHotel>;
}

export interface IHotelRoom {
  _id: ID;
  hotel: Hotel;
  description?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}

export class SearchRoomsParams extends SearchBaseParams {
  hotel?: ID;
  isEnabled?: boolean;
}

export interface IHotelRoomService {
  create(
    images: Array<Express.Multer.File>,
    dto: CreateHotelRoomDto,
  ): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(query: SearchRoomsParams): Promise<HotelRoom[]>;
  update(
    images: Array<Express.Multer.File>,
    id: ID,
    dto: Partial<CreateHotelRoomDto>,
  ): Promise<HotelRoom>;
}
