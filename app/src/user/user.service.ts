import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoError } from "mongodb";
import {
  IUser,
  IUserService,
  SearchUserParams,
  UserSearchParams,
} from "./user.types";
import { User, UserDocument } from "./entities/user.entity";
import { hashPassword } from "./lib/hashPassword";
import type { ID } from "src/types/general";
import { CreateUserDto } from "./dto/create-user.dto";
import { EXCEPTION_USER_ERRORS, selectingUserParams } from "./user.constants";

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<IUser> {
    const { email, password, name, contactPhone, role } = data;
    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      name,
      contactPhone,
      role,
    };

    try {
      return await this.userModel.create(userData);
    } catch (error) {
      const { message } = error as MongoError;

      // Сообщение от Mongo, если есть дубликат
      // E11000 duplicate key error collection
      if (message.indexOf("E11000 duplicate key error collection") === 0) {
        throw new BadRequestException(EXCEPTION_USER_ERRORS.ALREADY_EXISTS);
      }

      throw new InternalServerErrorException(
        EXCEPTION_USER_ERRORS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(params: SearchUserParams): Promise<IUser[]> {
    const { limit = 40, offset = 0 } = params;
    const filterParams = this.constructFilterParamsForFindAll(params);

    try {
      return await this.userModel
        .find(filterParams)
        .skip(offset)
        .limit(limit)
        .select(selectingUserParams)
        .exec();
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException(
        EXCEPTION_USER_ERRORS.INTERNAL_SERVER_ERROR,
        {
          description: message,
        },
      );
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      const findedUser = await this.userModel.findOne({ email });

      if (findedUser) {
        return findedUser;
      }

      throw new BadRequestException(EXCEPTION_USER_ERRORS.NOT_FOUND);
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException(
        EXCEPTION_USER_ERRORS.INTERNAL_SERVER_ERROR,
        {
          description: message,
        },
      );
    }
  }

  async findById(id: ID): Promise<IUser> {
    try {
      const findedUser = await this.findUserByIdFromDb(id);

      if (findedUser) {
        return findedUser;
      }

      throw new BadRequestException(EXCEPTION_USER_ERRORS.NOT_FOUND);
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException(
        EXCEPTION_USER_ERRORS.INTERNAL_SERVER_ERROR,
        {
          description: message,
        },
      );
    }
  }

  private async findUserByIdFromDb(id: ID) {
    return await this.userModel.findById(id).exec();
  }

  private constructFilterParamsForFindAll(params: SearchUserParams) {
    const { email, name, contactPhone } = params;

    const filterParams: UserSearchParams = {};

    if (email) {
      filterParams.email = { $regex: new RegExp(email, "gi") };
    }

    if (name) {
      filterParams.name = { $regex: new RegExp(name, "gi") };
    }

    if (contactPhone) {
      filterParams.contactPhone = { $regex: new RegExp(contactPhone, "gi") };
    }

    return filterParams;
  }
}
