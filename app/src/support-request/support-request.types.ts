import { IsBoolean, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ID, SearchBaseParams } from "src/types/general";
import { User } from "src/user/entities/user.entity";
import { Message } from "./entities/message.entity";
import { CreateSupportRequestDto } from "./dto/create-support-request.dto";
import { SendMessageDto } from "./dto/send-message.dto";
import { SupportRequest } from "./entities/support-request.entity";
import { MarkMessagesAsReadDto } from "./dto/mark-messages-as-read.dto";

export interface IMessage {
  _id: ID;
  author: User;
  sentAt: Date;
  text: string;
  readAt?: Date;
}

export interface ISupportRequest {
  user: User;
  createdAt: Date;
  messages?: Message[];
  isActive?: boolean;
}

export interface SupportRequestResponse extends ISupportRequest {
  _id?: ID;
  id?: ID;
  hasNewMessages: boolean;
  client: Partial<User & { id?: ID }>;
}

export class GetChatListParams extends SearchBaseParams {
  _id?: ID;
  user?: ID | null;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<ISupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<Partial<SupportRequestResponse>>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
