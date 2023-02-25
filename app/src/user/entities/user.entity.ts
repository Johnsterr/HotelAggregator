import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
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
