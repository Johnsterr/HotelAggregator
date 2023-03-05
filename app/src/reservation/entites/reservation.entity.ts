import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { Hotel } from "src/hotel/entities/hotel.entity";
import { HotelRoom } from "src/hotel/entities/hotel-room.entity";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  // ** Note **
  @Prop({ required: true, unique: true })
  public _id: Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public userId: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Hotel" })
  public hotelId: Hotel;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelRoom",
  })
  public roomId: HotelRoom;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
