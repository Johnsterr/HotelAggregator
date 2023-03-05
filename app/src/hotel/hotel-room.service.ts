import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoError } from "mongodb";
import { IHotelRoomService, SearchRoomsParams } from "./hotel.types";
import { HotelRoom, HotelRoomDocument } from "./entities/hotel-room.entity";

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(hotelRoomData: Partial<HotelRoom>): Promise<HotelRoom | any> {
    const { hotel, description, images, isEnabled } = hotelRoomData;

    const hotelRoom = new this.hotelRoomModel({
      hotel,
      description,
      images,
      isEnabled,
    });
    const createdHotelRoom = await hotelRoom.save();

    return await this.hotelRoomModel
      .aggregate([
        { $match: { _id: createdHotelRoom._id } },
        {
          $lookup: {
            from: "hotels",
            localField: "hotel",
            foreignField: "_id",
            as: "result",
          },
        },
        { $unwind: "$result" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            description: 1,
            images: 1,
            hotel: { id: "$result._id", title: "$result.title" },
          },
        },
      ])
      .exec();
  }
  //findById(id: ID): Promise<HotelRoom> {}
  //search(params: SearchRoomsParams): Promise<HotelRoom[]> {}
  //update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {}
}
