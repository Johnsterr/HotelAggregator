import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IHotelRoomService, SearchRoomsParams } from "./hotel.types";
import { HotelRoom, HotelRoomDocument } from "./entities/hotel-room.entity";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";
import { ID } from "src/types/general";
import { populatingHotelParam } from "./hotel.constants";
import { selectingHotelRoomParams } from "./hotel-room.constants";

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(dto: CreateHotelRoomDto): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomModel.create(dto);
    return hotelRoom;
  }

  async findById(id: ID): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomModel
      .findById(id)
      .populate(populatingHotelParam)
      .select(selectingHotelRoomParams)
      .exec();
    return hotelRoom;
  }

  async update(id: ID, dto: Partial<CreateHotelRoomDto>): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomModel
      .findByIdAndUpdate(id, dto)
      .exec();

    return await this.findById(hotelRoom._id);
  }

  async search(query: SearchRoomsParams): Promise<HotelRoom[]> {
    const { hotel, limit = 40, offset = 0, isEnabled } = query;
    const queryParams: SearchRoomsParams = {};

    if (hotel) {
      queryParams.hotel = hotel;
    }

    if (String(isEnabled) === "false") {
      queryParams.isEnabled = false;
    }

    const hotelRooms = await this.hotelRoomModel
      .find(queryParams)
      .limit(limit)
      .skip(offset)
      .populate(populatingHotelParam)
      .select(selectingHotelRoomParams)
      .exec();

    return hotelRooms;
  }
}
