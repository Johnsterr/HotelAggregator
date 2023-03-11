import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IUser, UserRole } from "../user.types";

export type UserDocument = User & Document;

@Schema()
export class User implements Omit<IUser, "_id"> {
  @Prop({ required: true, unique: true, type: String })
  public email: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ type: String, default: "" })
  public contactPhone: string;

  @Prop({ required: true, type: String, default: "client" })
  public role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
