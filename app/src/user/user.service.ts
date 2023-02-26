import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoError } from "mongodb";
import { IUser, IUserService, SearchUserParams } from "./user.types";
import { User, UserDocument } from "./entities/user.entity";
import { hashPassword } from "./lib/hashPassword";

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: IUser) {
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
      //console.log(error);
      throw new BadRequestException("User not created", {
        description: message,
      });

      // console.log(error.message);
      // console.log(error.name);
      // console.log(error.code);
      // console.log(error.errmsg);
      // console.log(error.errorLabels);
    }

    // if (createdUser) {
    //   return await this.aggregateNewUserData(createdUser);
    // }

    // return {
    //   statusCode: HttpStatus.BAD_REQUEST,
    //   errors: [],
    //   message: `User with ${data} not created`,
    // };

    // const createdUser = await this.saveUserIntoDb({
    //   email,
    //   password: hashedPassword,
    //   name,
    //   contactPhone,
    //   role,
    // });
  }

  async findAll(params: SearchUserParams) {
    const { email, limit, offset, name, contactPhone } = params;

    const aggr = email
      ? { email }
      : {
          $and: [
            { name: { $regex: new RegExp(name, "g") } },
            { contactPhone: { $regex: new RegExp(contactPhone, "g") } },
          ],
        };
    const aggrAns = await this.userModel
      .aggregate([
        {
          $match: aggr,
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            email: 1,
            name: 1,
            contactPhone: 1,
          },
        },
      ])
      .skip(offset)
      .limit(limit)
      .exec();
    return aggrAns;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  private async saveUserIntoDb(userData: IUser) {
    return await new this.userModel(userData).save();
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
}
