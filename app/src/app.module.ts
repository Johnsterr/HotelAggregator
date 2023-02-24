import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { isDevelopmentMode } from "./config/general";
import { buildMongoConfig } from "./config/mongo";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: isDevelopmentMode() ? "../.env-example" : "../.env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildMongoConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
