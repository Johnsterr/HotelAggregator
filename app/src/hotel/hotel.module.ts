import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HotelService } from "./hotel.service";
import { HotelRoomService } from "./hotel-room.service";
import { HotelController } from "./hotel.controller";
import { Hotel, HotelSchema } from "./entities/hotel.entity";
import { HotelRoom, HotelRoomSchema } from "./entities/hotel-room.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService],
})
export class HotelModule {}
