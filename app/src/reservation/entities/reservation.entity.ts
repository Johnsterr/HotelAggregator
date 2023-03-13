import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { IReservation } from "../reservation.types";
import { User } from "src/user/entities/user.entity";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation implements Omit<IReservation, "_id"> {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public user: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Hotel" })
  public hotel: Hotel;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelRoom",
  })
  public room: HotelRoom;

  @Prop({ required: true, type: Date })
  public dateStart: Date;

  @Prop({ required: true, type: Date })
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
