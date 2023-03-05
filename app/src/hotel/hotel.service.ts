import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoError } from "mongodb";
import { IHotelService, UpdateHotelParams } from "./hotel.types";
import { Hotel, HotelDocument } from "./entities/hotel.entity";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { ID } from "src/types/general";

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(hotelData: CreateHotelDto): Promise<Hotel> {
    const { title, description } = hotelData;
    const hotel = new this.hotelModel({ title, description });

    const createdHotel = await hotel.save();

    const answer = await this.hotelModel.aggregate([
      { $match: { _id: createdHotel._id } },
      { $project: { _id: 0, id: "$_id", title: 1, description: 1 } },
    ]);
    return answer[0];
  }
  //findById(id: ID): Promise<Hotel> {}
  //search(params: SearchHotelParams): Promise<Hotel[]> {}
  async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    const { title, description } = data;
    const findedHotel = await this.hotelModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
      },
      { upsert: true, useFindAndModify: false },
    );
    const answer = await this.hotelModel.aggregate([
      { $match: { _id: findedHotel._id } },
      { $project: { _id: 0, id: "$_id", title: 1, description: 1 } },
    ]);
    return answer[0];
  }
}
