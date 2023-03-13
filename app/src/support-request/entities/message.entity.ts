import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { IMessage } from "../support-request.types";

export type MessageDocument = Message & Document;

@Schema()
export class Message implements Omit<IMessage, "_id"> {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public author: User;

  @Prop({ required: true, type: Date, default: new Date() })
  public sentAt: Date;

  @Prop({ type: String, required: true })
  public text: string;

  @Prop()
  public readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
