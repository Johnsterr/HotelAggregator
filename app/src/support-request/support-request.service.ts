import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter } from "node:events";
import { Model } from "mongoose";
import {
  populatingUserParam,
  EXCEPTION_SUPPORT_REQUEST_ERRORS,
  populatingGetMessagesParam,
  selectingNewMessageParam,
  populatingAuthorParam,
} from "./support-request.constants";
import {
  GetChatListParams,
  ISupportRequest,
  ISupportRequestService,
} from "./support-request.types";
import { Message, MessageDocument } from "./entities/message.entity";
import {
  SupportRequest,
  SupportRequestDocument,
} from "./entities/support-request.entity";
import { ID } from "src/types/general";
import { IUser } from "src/user/user.types";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  public chatEmitter: EventEmitter;

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {
    this.chatEmitter = new EventEmitter();
  }

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<ISupportRequest[]> {
    const { limit = 40, offset = 0 } = params;
    const searchParams: Partial<GetChatListParams> =
      this.constructSearchParams(params);

    const requests = await this.supportRequestModel
      .find(searchParams)
      .limit(limit)
      .skip(offset)
      .populate({
        path: "messages",
      })
      .populate(populatingUserParam);

    return requests;
  }

  async sendMessage({
    supportRequest,
    ...dto
  }: SendMessageDto): Promise<Message> {
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .exec();

    if (request) {
      const message = await this.messageModel.create(dto);
      await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
        messages: [...request.messages, message],
      });
      const newMessage = await this.messageModel
        .findById(message._id)
        .select(selectingNewMessageParam)
        .populate(populatingAuthorParam);

      this.chatEmitter.emit("newMessage", {
        supportRequest,
        message: newMessage,
      });

      return newMessage;
    }

    throw new NotFoundException(EXCEPTION_SUPPORT_REQUEST_ERRORS.NOT_FOUND);
  }

  async getMessages(supportRequest: ID): Promise<any> {
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate(populatingGetMessagesParam)
      .exec();

    if (!request) {
      throw new NotFoundException(EXCEPTION_SUPPORT_REQUEST_ERRORS.NOT_FOUND);
    }

    return [...request.messages];
  }

  async hasSupportRequest(user: IUser, supportRequest: ID) {
    if (user.role === "client") {
      const hasSupportRequests = await this.findSupportRequests({
        user: user._id,
        _id: supportRequest,
      });

      if (!hasSupportRequests.length) {
        throw new ForbiddenException(
          EXCEPTION_SUPPORT_REQUEST_ERRORS.FORBIDDEN,
        );
      }
    }
  }

  subscribe(
    cb: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    this.chatEmitter.on("newMessage", ({ supportRequest, message }) => {
      cb(supportRequest, message);
    });
    return;
  }

  private constructSearchParams(params: GetChatListParams) {
    const { user, isActive, _id } = params;
    const searchParams: Partial<GetChatListParams> = {};

    if (user) {
      searchParams.user = user;
    }

    if (String(isActive) === "false") {
      searchParams.isActive = false;
    }

    if (_id) {
      searchParams._id = _id;
    }

    return searchParams;
  }
}
