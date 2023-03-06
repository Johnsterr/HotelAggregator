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

  @Get("/common/hotel-rooms")
  async getAllRooms(
    @Query("hotel") hotel?,
    @Query("limit") limit?,
    @Query("offset") offset?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const isEnabled = true;
    return await this.hotelRoomService.search({
      hotel,
      limit,
      offset,
      isEnabled,
    });
  }

  @Get("/common/hotel-rooms/:id")
  async getHotelRoom(@Param() params) {
    const id = params.id;
    return await this.hotelRoomService.findById(id);
  }

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

  // JWT & AdminRole Guards
  @Get("/admin/hotel-rooms/:id")
  async getHotelRoomById(@Param() params) {
    const id = params.id;
    return await this.hotelRoomService.findById(id);
  }

  // JWT & AdminRole Guards
  @Get("/admin/hotel-rooms/")
  async getAllHotelRooms(
    @Query("hotel") hotel?,
    @Query("limit") limit?,
    @Query("offset") offset?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const isEnabled = true;
    return await this.hotelRoomService.search({
      hotel,
      limit,
      offset,
      isEnabled,
    });
  }

  // JWT & AdminRole Guards
  @Put("/admin/hotel-rooms/:id")
  @UseInterceptors(
    FilesInterceptor("images", 5, {
      storage: diskStorage({
        destination: "./upload/rooms-imgs",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateHotelRoom(
    @Param() params,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    const isEnabled = true;
    const images = files.map((file) => file.path);
    const id = params.id;
    const { description, hotelId } = body;
    const hotel = hotelId;
    return await this.hotelRoomService.update(id, {
      description,
      hotel,
      images,
      isEnabled,
    });
  }
}
