import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IHotel } from "../hotel.types";

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel implements Omit<IHotel, "_id"> {
  @Prop({ required: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true, default: new Date().toISOString() })
  public createdAt: Date;

  @Prop({ required: true, default: new Date().toISOString() })
  public updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
