import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IHotelRoomService, SearchRoomsParams } from "./hotel.types";
import { HotelRoom, HotelRoomDocument } from "./entities/hotel-room.entity";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";
import { ID } from "src/types/general";
import { populatingHotelParam } from "./hotel.constants";
import { selectingHotelRoomParams } from "./hotel-room.constants";
import { publicFolderPath } from "src/main";
import { writeFile, mkdirSync, rm, existsSync } from "fs";

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(
    files: Array<Express.Multer.File>,
    dto: CreateHotelRoomDto,
  ): Promise<HotelRoom> {
    const createdHotelRoom = await this.hotelRoomModel.create(dto);

    const images = await this.saveImages(createdHotelRoom._id, files);

    const resultHotelRoom = await this.hotelRoomModel
      .findByIdAndUpdate(
        createdHotelRoom._id,
        {
          ...dto,
          images,
        },
        { timestamps: { updatedAt: false } },
      )
      .exec();

    return await this.findById(resultHotelRoom._id);
  }

  async findById(id: ID): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomModel
      .findById(id)
      .populate(populatingHotelParam)
      .select(selectingHotelRoomParams)
      .exec();
    return hotelRoom;
  }

  async update(
    files: Array<Express.Multer.File>,
    id: ID,
    dto: Partial<CreateHotelRoomDto>,
  ): Promise<HotelRoom> {
    const savingImages = files.length
      ? await this.updatedImagesPaths(id, files)
      : this.getImagesPathsFromDb(id);

    const hotelRoom = await this.hotelRoomModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        images: savingImages,
      },
      { timestamps: { updatedAt: true } },
    );

    return await this.findById(hotelRoom._id);
  }

  async search(query: SearchRoomsParams): Promise<HotelRoom[]> {
    const { hotel, limit = 40, offset = 0, isEnabled } = query;
    const queryParams: SearchRoomsParams = {};

    if (hotel) {
      queryParams.hotel = hotel;
    }

    if (String(isEnabled) === "false") {
      queryParams.isEnabled = false;
    }

    const hotelRooms = await this.hotelRoomModel
      .find(queryParams)
      .limit(limit)
      .skip(offset)
      .populate(populatingHotelParam)
      .select(selectingHotelRoomParams)
      .exec();

    return hotelRooms;
  }

  private async saveImages(hotelRoomId: ID, files: Array<Express.Multer.File>) {
    if (!files.length) {
      return [];
    }

    const filesPaths: string[] = [];
    const uploadFolder = `${publicFolderPath}/upload/${hotelRoomId}`;

    if (!existsSync(uploadFolder)) {
      mkdirSync(uploadFolder);
    }

    for (const file of files) {
      if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        writeFile(
          `${uploadFolder}/${file.originalname}`,
          file.buffer,
          { encoding: null },
          (error) => {
            if (error) {
              console.log("\nWrite file error: \n", error);
            }
          },
        );
        filesPaths.push(`/upload/${hotelRoomId}/${file.originalname}`);
      }
    }

    return filesPaths;
  }

  private async updatedImagesPaths(id: ID, files: Array<Express.Multer.File>) {
    const imagesToSave = await this.saveImages(id, files);
    const imagesFromDb = await this.getImagesPathsFromDb(id);
    const imagesForDeleting = imagesFromDb.filter(
      (image) => !imagesToSave.includes(image),
    );

    await this.deleteImages(imagesForDeleting);

    return imagesToSave;
  }

  private async getImagesPathsFromDb(id: ID) {
    const findedHotelRoom = await this.findById(id);
    return findedHotelRoom.images;
  }

  private async deleteImages(imagesPath: string[]) {
    if (imagesPath.length > 0) {
      imagesPath.forEach((imagePath) => {
        rm(`${publicFolderPath}${imagePath}`, (error) => {
          if (error) {
            console.log("\nDelete file error: \n", error);
          }
        });
      });
    }
  }
}
