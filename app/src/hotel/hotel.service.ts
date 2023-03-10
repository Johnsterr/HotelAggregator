import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IHotelService, SearchHotelParams } from "./hotel.types";
import { Hotel, HotelDocument } from "./entities/hotel.entity";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { ID } from "src/types/general";
import { UpdateHotelDto } from "./dto/update-hotel.dto";
import { selectingHotelParams } from "./hotel.constants";

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(dto: CreateHotelDto): Promise<Hotel> {
    return await this.hotelModel.create(dto);
  }

  async findById(id: ID): Promise<Hotel> {
    return await this.hotelModel.findById(id);
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const { title, limit = 40, offset = 0 } = params;
    const searchParams: { title?: { $regex: string } } = {};

    if (title) {
      searchParams.title = { $regex: title };
    }

    return await this.hotelModel
      .find(searchParams)
      .limit(limit)
      .skip(offset)
      .select(selectingHotelParams);
  }

  async update(id: ID, dto: UpdateHotelDto): Promise<Hotel> {
    return await this.hotelModel.findOneAndUpdate({ _id: id }, dto);
  }
}
