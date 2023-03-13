import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { isDevelopmentMode } from "./config/general";
import { buildMongoConfig } from "./config/mongo";
import { HotelModule } from "./hotel/hotel.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ReservationModule } from "./reservation/reservation.module";
import { SupportRequestModule } from "./support-request/support-request.module";

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
    HotelModule,
    AuthModule,
    UserModule,
    ReservationModule,
    SupportRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
