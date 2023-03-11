import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { EXCEPTION_USER_ERRORS } from "src/user/user.constants";

@Injectable()
export class LoginGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const isValid =
      request.isAuthenticated() && request.user.name && request.user.role;

    if (isValid) {
      return isValid;
    }

    throw new UnauthorizedException(EXCEPTION_USER_ERRORS.UNAUTHORIZED);
  }
}

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const isNotValid = !request.isAuthenticated();

    return isNotValid;
  }
}
