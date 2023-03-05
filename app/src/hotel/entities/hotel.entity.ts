import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  // ** Note **
  @Prop({ required: true, unique: true })
  public _id: Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({ required: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true })
  public createdAt: Date = new Date();

  @Prop({ required: true })
  public updatedAt: Date = new Date();
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
