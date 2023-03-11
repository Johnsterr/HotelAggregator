import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { Reflector } from "@nestjs/core";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException(EXCEPTION_USER_ERRORS.UNAUTHORIZED);
    }

    const { user } = request;
    const hasRole = !!roles.find((item) => item === user.role);

    return hasRole;
  }
}
