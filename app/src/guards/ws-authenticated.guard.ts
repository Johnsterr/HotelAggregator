import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Request } from "express";
import { IUser } from "src/user/user.types";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient();
    const { request } = socket;
    let isValidUser = false;

    if (request.user) {
      const { user } = request as Request & { user: IUser };

      if (user.role === "client" || user.role === "manager") {
        isValidUser = true;
      }
    }

    if (isValidUser) {
      return isValidUser && request.isAuthenticated();
    }

    throw new WsException(EXCEPTION_USER_ERRORS.UNAUTHORIZED);
  }
}
