import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { Reservation, ReservationSchema } from "./entities/reservation.entity";
import { HotelRoomService } from "src/hotel/hotel-room.service";
import {
  HotelRoom,
  HotelRoomSchema,
} from "src/hotel/entities/hotel-room.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, HotelRoomService],
})
export class ReservationModule {}
