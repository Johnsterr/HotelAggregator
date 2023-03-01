import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoError } from "mongodb";
import { IUser, IUserService, SearchUserParams } from "./user.types";
import { User, UserDocument } from "./entities/user.entity";
import { hashPassword } from "./lib/hashPassword";
import type { SortType } from "./user.types";
import type { UserId } from "./user.types";

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: IUser): Promise<User> {
    const { email, password, name, contactPhone, role } = data;
    const hashedPassword = await hashPassword(password);

    try {
      const createdUser = await this.saveUserIntoDb({
        email,
        password: hashedPassword,
        name,
        contactPhone,
        role,
      });

      return await this.aggregateNewUserData(createdUser);
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException("User not created", {
        description: message,
      });
    }
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    const filterParams = this.constructFilterParamsForFindAll(params);

    try {
      return await this.userModel.aggregate(filterParams).exec();
    } catch (error) {
      const { message } = error as MongoError;
      throw new InternalServerErrorException("Internal server error", {
        description: message,
      });
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const createdUser = await this.findUserByEmailFromDb(email);

      return await this.aggregateFindedUserData(createdUser);
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException("User not found", {
        description: message,
      });
    }
  }

  async findById(id: UserId): Promise<User> {
    try {
      const createdUser = await this.findUserByIdFromDb(id);

      return await this.aggregateFindedUserData(createdUser);
    } catch (error) {
      const { message } = error as MongoError;
      throw new BadRequestException("User not found", {
        description: message,
      });
    }
  }

  private async saveUserIntoDb(userData: IUser) {
    return await new this.userModel(userData).save();
  }

  private async findUserByEmailFromDb(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  private async findUserByIdFromDb(id: UserId) {
    return await this.userModel.findById(id).exec();
  }

  private async aggregateNewUserData(userData: IUser) {
    const aggrAns = await this.userModel
      .aggregate([
        { $match: { _id: userData._id } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            email: 1,
            name: 1,
            contactPhone: 1,
            role: 1,
          },
        },
      ])
      .exec();

    return aggrAns[0];
  }

  private constructFilterParamsForFindAll(
    params: SearchUserParams,
    sort: SortType = "asc",
  ) {
    const { email, limit, offset, name, contactPhone } = params;

    const filterParams = [];
    const matchingParams = [];

    if (email) {
      matchingParams.push({
        email: { $regex: new RegExp(email, "gi") },
      });
    }

    if (name) {
      matchingParams.push({
        name: { $regex: new RegExp(name, "gi") },
      });
    }

    if (contactPhone) {
      matchingParams.push({
        contactPhone: { $regex: new RegExp(contactPhone, "gi") },
      });
    }

    if (matchingParams.length > 0) {
      filterParams.push({
        $match: {
          $or: matchingParams,
        },
      });
    }

    filterParams.push({ $sort: { name: sort === "asc" ? 1 : -1 } });

    if (offset > 0) {
      filterParams.push({ $skip: offset });
    }

    if (limit > 0) {
      filterParams.push({ $limit: limit });
    }

    filterParams.push({
      $project: {
        _id: 0,
        id: "$_id",
        email: 1,
        name: 1,
        contactPhone: 1,
      },
    });

    return filterParams;
  }

  private async aggregateFindedUserData(userData: IUser) {
    const aggrAns = await this.userModel
      .aggregate([
        { $match: { _id: userData._id } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            email: 1,
            password: 1,
            name: 1,
            contactPhone: 1,
            role: 1,
          },
        },
      ])
      .exec();

    return aggrAns[0];
  }
}
