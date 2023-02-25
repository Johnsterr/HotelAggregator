import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser, IUserService } from "./user.types";
import { User, UserDocument } from "./entities/user.entity";
import { hashPassword } from "./lib/hashPassword";

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: IUser) {
    const { email, password, name, contactPhone, role } = data;

    const hashedPassword = await hashPassword(password);

    const createdUser = await this.saveUserIntoDb({
      email,
      password: hashedPassword,
      name,
      contactPhone,
      role,
    });

    return await this.aggregateNewUserData(createdUser);
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

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
