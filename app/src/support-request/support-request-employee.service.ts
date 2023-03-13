import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isBefore } from "date-fns";
import { Model } from "mongoose";
import { ISupportRequestEmployeeService } from "./support-request.types";
import { Message, MessageDocument } from "./entities/message.entity";
import {
  SupportRequest,
  SupportRequestDocument,
} from "./entities/support-request.entity";
import { ID } from "src/types/general";
import { MarkMessagesAsReadDto } from "./dto/mark-messages-as-read.dto";
import { User } from "src/user/entities/user.entity";
import { EXCEPTION_SUPPORT_REQUEST_ERRORS } from "./support-request.constants";

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async closeRequest(supportRequest: ID): Promise<void> {
    return await this.supportRequestModel.findById(supportRequest, {
      isActive: false,
    });
  }

  async markMessagesAsRead(dto: MarkMessagesAsReadDto) {
    const request = await this.supportRequestModel
      .findById(dto.supportRequest)
      .populate({
        path: "messages",
      });

    if (request) {
      const { messages, user } = request;
      const { _id: createRequestUserId } = user as User & { _id: ID };

      console.log(messages);

      const userMessages = messages
        .filter(
          (message: Message) =>
            String(createRequestUserId) === String(message.author) &&
            isBefore(new Date(message.sentAt), new Date(dto.createdBefore)) &&
            !!message?.readAt === false,
        )
        .map((filterMessage: Message & { _id: ID }) => filterMessage._id);

      await this.messageModel.updateMany(
        { _id: { $in: userMessages } },
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
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate({ path: "messages" })
      .exec();
    if (request) {
      const unreadMessages = request?.messages
        .filter(
          (message: Message) => String(request.user) === String(message.author),
        )
        .reduce((acc, message) => {
          return !!message.readAt === false ? acc + 1 : acc;
        }, 0);
      return unreadMessages;
    }

    throw new ForbiddenException(EXCEPTION_SUPPORT_REQUEST_ERRORS.FORBIDDEN);
  }
}
