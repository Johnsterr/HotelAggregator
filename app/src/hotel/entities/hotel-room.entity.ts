import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { IHotelRoom } from "../hotel.types";
import { Hotel } from "./hotel.entity";

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom implements Omit<IHotelRoom, "_id"> {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Hotel" })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ type: [String] })
  public images: string[];

  @Prop({ required: true, type: Date, default: new Date().toISOString() })
  public createdAt: Date;

  @Prop({ required: true, type: Date, default: new Date().toISOString() })
  public updatedAt: Date;

  @Prop({ required: true, type: Boolean, default: true })
  public isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
