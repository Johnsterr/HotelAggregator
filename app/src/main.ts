import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "./pipes/validation.pipe";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import { resolve } from "path";

export const publicFolderPath = resolve(__dirname, "../public"); // /app/public

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //console.log("\nConfigService:\n\n", configService, "\n");
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get("APP_PORT");
  const COOKIE_SECRET = configService.get("COOKIE_SECRET");

  const sessionMiddleware = session({
    secret: COOKIE_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  });

  app.useStaticAssets(publicFolderPath);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(APP_PORT || 3000);
}

bootstrap();
