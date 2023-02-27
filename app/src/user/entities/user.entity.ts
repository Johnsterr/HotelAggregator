import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  // ** Note **
  // @Prop({ required: true, unique: true })
  // _id: Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ default: "" })
  public contactPhone: string;

  @Prop({ required: true, default: "client" })
  public role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
