import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ID } from "src/types/general";
import { User } from "src/user/entities/user.entity";
import { Message } from "../entities/message.entity";
import { SupportRequestResponse } from "../support-request.types";

export interface Response<T> {
  data: T;
}

@Injectable()
export class SupportRequestsResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { role } = req.user;

    return next.handle().pipe(
      map((supportRequests) =>
        supportRequests.map((supportRequest: SupportRequestResponse) => {
          const { id, isActive, createdAt, messages, user } = supportRequest;

          let res: Partial<SupportRequestResponse> = {};
          res = { id, isActive, createdAt };

          const { _id: createSupportRequestUserID } = user as User & {
            _id: ID;
          };

          if (role === "client") {
            const filterMessages = messages.filter(
              (message: Message) =>
                String(createSupportRequestUserID) !== String(message.author),
            );
            res.hasNewMessages = filterMessages.some(
              (message: Message) => !!message?.readAt === false,
            );
          }

          if (role === "manager") {
            const filterMessages = messages.filter(
              (message: Message) =>
                String(createSupportRequestUserID) === String(message.author),
            );
            res.hasNewMessages = filterMessages.some(
              (message: Message) => !!message?.readAt === false,
            );

            res.client = {
              id: createSupportRequestUserID,
              email: user.email,
              name: user.name,
              contactPhone: user.contactPhone,
            };
          }

          return res;
        }),
      ),
    );
  }
}
