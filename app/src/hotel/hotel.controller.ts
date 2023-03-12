import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "src/guards/roles.guard";
import { Request } from "express";
import { HotelService } from "./hotel.service";
import { HotelRoomService } from "./hotel-room.service";
import { IUser } from "src/user/user.types";
import { SearchRoomsParams } from "./hotel.types";
import { ID, SearchBaseParams } from "src/types/general";
import { ValidationIdPipe } from "src/pipes/validation-id.pipe";
import { Roles } from "src/decorators/roles.decorator";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { UpdateHotelDto } from "./dto/update-hotel.dto";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";

@UseGuards(RolesGuard)
@Controller("api")
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get("/common/hotel-rooms")
  async getHotelRooms(
    @Req() req: Request & { user: IUser },
    @Query() query: SearchRoomsParams,
  ) {
    let queryParams = { ...query };

    if (!req.isAuthenticated() || req?.user?.role === "client") {
      queryParams = { ...queryParams, isEnabled: true };
    }

    return await this.hotelRoomService.search(queryParams);
  }

  @Get("/common/hotel-rooms/:id")
  async getHotelRoomById(@Param("id", ValidationIdPipe) id: ID) {
    return await this.hotelRoomService.findById(id);
  }

  @Post("/admin/hotels")
  @Roles("admin")
  async createHotel(@Body() body: CreateHotelDto) {
    return await this.hotelService.create(body);
  }

  @Get("/admin/hotels")
  @Roles("admin")
  async getHotels(@Query() query: SearchBaseParams) {
    return await this.hotelService.search(query);
  }

  @Put("/admin/hotels/:id")
  @Roles("admin")
  async updateHotel(
    @Param("id", ValidationIdPipe) id: ID,
    @Body() body: UpdateHotelDto,
  ) {
    return await this.hotelService.update(id, body);
  }

  @Post("/admin/hotel-rooms")
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("images"))
  async creatHotelRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() body: CreateHotelRoomDto,
  ) {
    return await this.hotelRoomService.create(images, body);
  }

  @Put("/admin/hotel-rooms/:id")
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("images"))
  async updateHotelRoom(
    @UploadedFiles() images: Express.Multer.File[],
    @Param("id", ValidationIdPipe) id: ID,
    @Body() body: CreateHotelRoomDto,
  ) {
    return await this.hotelRoomService.update(images, id, body);
  }
}
