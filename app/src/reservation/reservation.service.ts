import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { differenceInDays } from "date-fns";
import { Reservation, ReservationDocument } from "./entites/reservation.entity";
import {
  IReservationService,
  ISearchReservationParam,
  SearchReservationParams,
} from "./reservation.types";
import { ID } from "src/types/general";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import {
  EXCEPTION_RESERVATION_ERRORS,
  MINIMAL_DAYS_FOR_RESERVATION,
  selectingReservationParams,
} from "./reservation.constants";
import { populatingHotelParam } from "src/hotel/hotel.constants";
import { populatingHotelRoomParam } from "src/hotel/hotel-room.constants";

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(dto: CreateReservationDto): Promise<Reservation> {
    const datesIsValid = await this.checkReservationDates(dto);
    if (datesIsValid) {
      const reservation = await this.reservationModel.create(dto);
      return await this.findById(reservation._id);
    } else {
      throw new NotFoundException(
        EXCEPTION_RESERVATION_ERRORS.ROOM_IS_OCCUPIED,
      );
    }
  }

  async getReservations(
    query: SearchReservationParams,
  ): Promise<Reservation[]> {
    const { limit = 40, offset = 0, user, dateStart, dateEnd } = query;
    const searchParams: ISearchReservationParam = { user };

    if (dateStart) {
      searchParams.dateStart = { $gte: dateStart };
    }

    if (dateEnd) {
      searchParams.dateEnd = { $lte: dateEnd };
    }

    const resultReservations = await this.reservationModel
      .find(searchParams)
      .limit(limit)
      .skip(offset)
      .select(selectingReservationParams)
      .populate(populatingHotelParam)
      .populate(populatingHotelRoomParam);

    return resultReservations;
  }

  async removeReservation(room: ID, user?: ID): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(room);
    if (reservation) {
      if (user) {
        if (String(reservation.user) === user) {
          return await this.reservationModel
            .findByIdAndRemove(room)
            .select(selectingReservationParams)
            .populate(populatingHotelParam)
            .populate(populatingHotelRoomParam);
        }
      } else {
        return await this.reservationModel
          .findByIdAndRemove(room)
          .select(selectingReservationParams)
          .populate(populatingHotelParam)
          .populate(populatingHotelRoomParam);
      }

      throw new ForbiddenException(EXCEPTION_RESERVATION_ERRORS.USER_NOT_VALID);
    }

    throw new BadRequestException(
      EXCEPTION_RESERVATION_ERRORS.RESERVATION_IS_NOT_EXIST,
    );
  }

  private async findById(id: ID) {
    const findedReservation = await this.reservationModel
      .findById(id)
      .select(selectingReservationParams)
      .populate(populatingHotelParam)
      .populate(populatingHotelRoomParam);

    return findedReservation;
  }

  private async checkReservationDates(dto: CreateReservationDto) {
    const { dateStart, dateEnd } = dto;

    if (
      differenceInDays(new Date(dateEnd), new Date(dateStart)) <
      MINIMAL_DAYS_FOR_RESERVATION
    ) {
      throw new NotFoundException(
        EXCEPTION_RESERVATION_ERRORS.MIN_DAYS_RESERVATION,
      );
    }

    // Дата начала и окончания брони - это дата начала в запросе
    if (!this.isDateStartInInterval(dto)) {
      // Дата начала и окончания брони - это дата окончания в запросе
      if (!this.isDateEndInInterval(dto)) {
        // Дата начала брони - это дата начала в запросе
        // Дата окончания брони - это дата окончания в запросе
        if (!this.isDateStartAndDateEndInInterval(dto)) {
          // Если не нашлось не одной подходящей брони, тогда можно бронировать
          return true;
        }
      }
    }
    return false;
  }

  private async isDateStartInInterval(dto: CreateReservationDto) {
    return await this.reservationModel.findOne({
      room: dto.room,
      dateStart: { $gte: dto.dateStart },
      dateEnd: { $lte: dto.dateStart },
    });
  }

  private async isDateEndInInterval(dto: CreateReservationDto) {
    return await this.reservationModel.findOne({
      room: dto.room,
      dateStart: { $gte: dto.dateEnd },
      dateEnd: { $lte: dto.dateEnd },
    });
  }

  private async isDateStartAndDateEndInInterval(dto: CreateReservationDto) {
    return await this.reservationModel.findOne({
      room: dto.room,
      dateStart: { $gte: dto.dateStart },
      dateEnd: { $lte: dto.dateEnd },
    });
  }
}
