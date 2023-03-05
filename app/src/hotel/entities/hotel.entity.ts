import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  // ** Note **
  // @Prop({
  //   required: true,
  //   unique: true,
  //   default: new mongoose.Types.ObjectId(),
  // })
  // public _id: Types.ObjectId;

  @Prop({ required: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true, default: new Date() })
  public createdAt: Date;

  @Prop({ required: true, default: new Date() })
  public updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
