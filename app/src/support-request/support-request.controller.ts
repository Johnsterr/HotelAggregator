import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { RolesGuard } from "src/guards/roles.guard";
import { SupportRequestService } from "./support-request.service";
import { SupportRequestClientService } from "./support-request-client.service";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import { Roles } from "src/decorators/roles.decorator";
import { IUser } from "src/user/user.types";
import { GetChatListParams } from "./support-request.types";
import { SupportRequestsResponseInterceptor } from "./interceptors/support-requests-response-interceptor";
import { ValidationIdPipe } from "src/pipes/validation-id.pipe";
import { ID } from "src/types/general";
import { MarkMessagesAsReadDto } from "./dto/mark-messages-as-read.dto";

@UseGuards(RolesGuard)
@Controller("api")
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Post("/client/support-requests")
  @Roles("client")
  async createSupportRequest(
    @Req() req: Request & { user: IUser },
    @Body("text") text: string,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: req?.user?._id,
      text,
    });
  }

  @Get("/client/support-requests")
  @Roles("client")
  @UseInterceptors(SupportRequestsResponseInterceptor)
  async getSupportRequest(
    @Req() req: Request & { user: IUser },
    @Query() query: GetChatListParams,
  ) {
    return await this.supportRequestService.findSupportRequests({
      ...query,
      user: req?.user?._id,
    });
  }

  @Get("/manager/support-requests")
  @Roles("manager")
  @UseInterceptors(SupportRequestsResponseInterceptor)
  async getSupportRequests(@Query() query: GetChatListParams) {
    return this.supportRequestService.findSupportRequests(query);
  }

  @Roles("client", "manager")
  @Get("/common/support-requests/:id/messages")
  async getMessages(
    @Req() req: Request & { user: IUser },
    @Param("id", ValidationIdPipe) id: ID,
  ) {
    const { user } = req;
    await this.supportRequestService.hasSupportRequest(user, id);

    return this.supportRequestService.getMessages(id);
  }

  @Roles("client", "manager")
  @Post("/common/support-requests/:id/messages")
  async sendMessages(
    @Req() req: Request & { user: IUser },
    @Param("id", ValidationIdPipe) id: ID,
    @Body("text") text: string,
  ) {
    const { user } = req;
    await this.supportRequestService.hasSupportRequest(user, id);

    return this.supportRequestService.sendMessage({
      author: user._id,
      supportRequest: id,
      text,
    });
  }

  @Roles("client", "manager")
  @Post("/common/support-requests/:id/messages/read")
  @HttpCode(200)
  async markMessagesAsRead(
    @Req() req: Request & { user: IUser },
    @Param("id", ValidationIdPipe) id: ID,
    @Body() dto: MarkMessagesAsReadDto,
  ) {
    const { user } = req;
    await this.supportRequestService.hasSupportRequest(user, id);

    if (user.role === "client") {
      return this.supportRequestClientService.markMessagesAsRead({
        user: user._id,
        supportRequest: id,
        createdBefore: dto.createdBefore,
      });
    }

    return this.supportRequestEmployeeService.markMessagesAsRead({
      user: user._id,
      supportRequest: id,
      createdBefore: dto.createdBefore,
    });
  }
}
