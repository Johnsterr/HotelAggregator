import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get("APP_PORT");

  //console.log("\nConfigService:\n\n", configService, "\n");

  await app.listen(APP_PORT || 3000);
}

bootstrap();
