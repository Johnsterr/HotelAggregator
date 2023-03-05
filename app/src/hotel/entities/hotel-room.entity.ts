import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Hotel } from "./hotel.entity";

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  // ** Note **
  // @Prop({
  //   required: true,
  //   unique: true,
  //   default: new mongoose.Types.ObjectId(),
  // })
  // public _id: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Hotel" })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ type: [String], default: [] })
  public images: string[];

  @Prop({ required: true, default: new Date() })
  public createdAt: Date;

  @Prop({ required: true, default: new Date() })
  public updatedAt: Date;

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
