import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { SessionSerializer } from "./helpers/session-serializer";

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [PassportModule, AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}

