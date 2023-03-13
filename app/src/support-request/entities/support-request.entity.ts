import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { ISupportRequest } from "../support-request.types";
import { Message } from "./message.entity";

export type SupportRequestDocument = SupportRequest & Document;

@Schema({ timestamps: true })
export class SupportRequest implements Omit<ISupportRequest, "_id"> {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public user: User;

  @Prop({ required: true, type: Date, default: new Date() })
  public createdAt: Date;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Message" })
  public messages: [Message];

  @Prop({ type: Boolean, default: true })
  public isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
