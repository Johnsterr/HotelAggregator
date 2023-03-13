import { UseGuards } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Request } from "express";
import { Socket, Server } from "socket.io";
import { WsAuthenticatedGuard } from "src/guards/ws-authenticated.guard";
import { SupportRequestService } from "./support-request.service";
import { IUser } from "src/user/user.types";
import { SupportRequest } from "./entities/support-request.entity";
import { Message } from "./entities/message.entity";

@WebSocketGateway()
export class SupportRequestGateway {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @WebSocketServer() server: Server;

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage("subscribeToChat")
  async handleMessage(
    @MessageBody("chatId") chatId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const { user } = socket.request as Request & { user: IUser };

    await this.supportRequestService.hasSupportRequest(user, chatId);
    this.supportRequestService.subscribe(
      (supportRequest: SupportRequest, message: Message) => {
        if (String(supportRequest) === chatId) {
          socket.emit(chatId, message);
        }
      },
    );
  }
}
