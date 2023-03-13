import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { Roles } from "src/decorators/roles.decorator";
import { IUser } from "src/user/user.types";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { HotelRoomService } from "src/hotel/hotel-room.service";
import { EXCEPTION_HOTEL_ROOM_ERRORS } from "src/hotel/hotel-room.constants";
import { ReservationService } from "./reservation.service";
import { RolesGuard } from "src/guards/roles.guard";
import { SearchReservationParams } from "./reservation.types";
import { ValidationIdPipe } from "src/pipes/validation-id.pipe";
import { ID } from "src/types/general";

@UseGuards(RolesGuard)
@Controller("api")
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Post("/client/reservations")
  @Roles("client")
  async addReservation(
    @Req() req: Request & { user: IUser },
    @Body() body: CreateReservationDto,
  ) {
    const room = await this.hotelRoomService.findOne(body.room);

    if (!room || !room.isEnabled) {
      throw new BadRequestException(EXCEPTION_HOTEL_ROOM_ERRORS.NOT_EXIST);
    }

    return await this.reservationService.addReservation({
      ...body,
      user: String(req?.user._id),
      hotel: String(room.hotel._id),
    });
  }

  @Get("/client/reservations")
  @Roles("client")
  async getReservations(
    @Req() req: Request & { user: IUser },
    @Query() query: SearchReservationParams,
  ) {
    const searchParams = { ...query, user: req.user?._id };
    return await this.reservationService.getReservations(searchParams);
  }

  @Delete("/client/reservations/:id")
  @Roles("client", "manager")
  async deleteReservation(
    @Param("id", ValidationIdPipe) room: ID,
    @Req() req: Request & { user: IUser },
  ) {
    if (req?.user?.role === "manager") {
      return await this.reservationService.removeReservation(room);
    } else {
      return await this.reservationService.removeReservation(
        room,
        req?.user?._id,
      );
    }
  }

  @Get("/client/reservations/:id")
  @Roles("manager")
  async getReservationsByUserId(
    @Param("id", ValidationIdPipe) user: ID,
    @Query() query: SearchReservationParams,
  ) {
    const searchParams = { ...query, user };
    return await this.reservationService.getReservations(searchParams);
  }
}
