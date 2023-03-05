import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Hotel } from "./hotel.entity";

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  // ** Note **
  @Prop({ required: true, unique: true })
  public _id: Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Hotel" })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images: string[];

  @Prop({ required: true })
  public createdAt: Date = new Date();

  @Prop({ required: true })
  public updatedAt: Date = new Date();

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
