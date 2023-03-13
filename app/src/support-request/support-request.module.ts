import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./entities/message.entity";
import {
  SupportRequest,
  SupportRequestSchema,
} from "./entities/support-request.entity";
import { SupportRequestService } from "./support-request.service";
import { SupportRequestClientService } from "./support-request-client.service";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import { SupportRequestGateway } from "./support-requests.gateway";
import { SupportRequestController } from "./support-request.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
  ],
  controllers: [SupportRequestController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    SupportRequestGateway,
  ],
})
export class SupportRequestModule {}
