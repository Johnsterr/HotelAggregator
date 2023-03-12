import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ValidationIdPipe implements PipeTransform {
  transform(value: Types.ObjectId) {
    if (Types.ObjectId.isValid(value)) return value;

    throw new BadRequestException("Wrong id");
  }
}
