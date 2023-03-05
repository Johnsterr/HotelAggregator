import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectId } from "mongoose";
import { diskStorage } from "multer";
import { HotelService } from "./hotel.service";
import { HotelRoomService } from "./hotel-room.service";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { editFileName, imageFileFilter } from "src/config/img-upload";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";

@Controller("api")
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  /*
      Hotels
  */
  // JWT & AdminRole Guards
  @Post("/admin/hotels/")
  @UsePipes(new ValidationPipe({ transform: true }))
  async addHotel(@Body() body: CreateHotelDto) {
    const { title, description } = body;
    return await this.hotelService.create({ title, description });
  }

  // JWT & AdminRole Guards
  @Get("/admin/hotels/:id")
  async getHotelById(@Param() params) {
    const id = params.id;
    return await this.hotelService.findById(id);
  }

  // JWT & AdminRole Guards
  @Get("/admin/hotels/")
  async getAllHotels(@Query("limit") limit?, @Query("offset") offset?) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    return await this.hotelService.search({ limit, offset });
  }

  // JWT & AdminRole Guards
  @Put("/admin/hotels/:id")
  async updateHotel(
    @Param() params,
    @Body() hotel: { title: string; description: string },
  ) {
    const id = params.id;
    return await this.hotelService.update(id, hotel);
  }

  /*
      Hotel Rooms
  */
  // JWT & AdminRole Guards
  @Post("/admin/hotel-rooms/")
  @UseInterceptors(
    FilesInterceptor("images", 5, {
      storage: diskStorage({
        destination: "./upload/rooms-imgs",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async addHotelRoom(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateHotelRoomDto,
  ) {
    const { description, hotelId } = body;
    const images = files.map((file) => file.path);
    const isEnabled = true;
    return await this.hotelRoomService.create({
      description,
      hotel: hotelId,
      images,
      isEnabled,
    });
  }

  @Get("/admin/hotel-rooms/:id")
  async getHotelRoomById(@Param() params) {
    const id = params.id;
    return await this.hotelRoomService.findById(id);
  }
}
