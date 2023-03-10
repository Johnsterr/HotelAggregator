import { IsOptional, IsString } from "class-validator";
import { ID, SearchBaseParams } from "src/types/general";
import { Hotel } from "./entities/hotel.entity";
import { HotelRoom } from "./entities/hotel-room.entity";

export interface IHotel {
  _id: ID;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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

export class SearchHotelParams extends SearchBaseParams {
  @IsOptional()
  @IsString()
  title?: string;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: any;
  isEnabled?: boolean;
}

export interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
