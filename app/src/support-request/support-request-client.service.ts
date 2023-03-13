import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isBefore } from "date-fns";
import { Model } from "mongoose";
import {
  ISupportRequestClientService,
  SupportRequestResponse,
} from "./support-request.types";
import { Message, MessageDocument } from "./entities/message.entity";
import {
  SupportRequest,
  SupportRequestDocument,
} from "./entities/support-request.entity";
import { CreateSupportRequestDto } from "./dto/create-support-request.dto";
import { ID } from "src/types/general";
import { EXCEPTION_SUPPORT_REQUEST_ERRORS } from "./support-request.constants";
import { User } from "src/user/entities/user.entity";
import { MarkMessagesAsReadDto } from "./dto/mark-messages-as-read.dto";

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async createSupportRequest(
    dto: CreateSupportRequestDto,
  ): Promise<Partial<SupportRequestResponse>> {
    const { user, text } = dto;

    const createdMessage = await this.messageModel.create({
      author: user,
      text,
    });

    const createdSupportRequest = await this.supportRequestModel.create({
      user,
      messages: [createdMessage],
    });

    const { _id: id, createdAt, isActive } = createdSupportRequest;

    return {
      id,
      createdAt,
      isActive,
      hasNewMessages: false,
    };
  }

  async markMessagesAsRead(dto: MarkMessagesAsReadDto) {
    const findedRequest = await this.supportRequestModel
      .findById(dto.supportRequest)
      .populate({
        path: "messages",
      });

    if (findedRequest) {
      const { messages, user } = findedRequest;
      const { _id: createRequestUserId } = user as User & { _id: ID };
      const notUserMessages = messages
        .filter(
          (message: Message) =>
            String(createRequestUserId) !== String(message.author) &&
            isBefore(new Date(message.sentAt), new Date(dto.createdBefore)) &&
            !!message.readAt === false,
        )
        .map((filterMessage: Message & { _id: ID }) => filterMessage._id);

      await this.messageModel.updateMany(
        { _id: { $in: notUserMessages } },
        {
          readAt: new Date(),
        },
      );

      const unreadCount = await this.getUnreadCount(dto.supportRequest);

      return { succes: true, unreadCount };
    }

    throw new NotFoundException(EXCEPTION_SUPPORT_REQUEST_ERRORS.NOT_FOUND);
  }

  async getUnreadCount(supportRequest: ID): Promise<number> {
    const findedRequest = await this.supportRequestModel
      .findById(supportRequest)
      .populate({ path: "messages" })
      .exec();
    if (findedRequest) {
      const filteredMessages = findedRequest?.messages.filter(
        (message: Message) =>
          String(findedRequest.user) !== String(message.author),
      );

      const unreadMessages = filteredMessages.reduce((acc, message) => {
        return !!message.readAt === false ? acc + 1 : acc;
      }, 0);

      return unreadMessages;
    }

    throw new ForbiddenException(EXCEPTION_SUPPORT_REQUEST_ERRORS.FORBIDDEN);
  }
}
