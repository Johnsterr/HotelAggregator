import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const instance = plainToInstance(metatype, value);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }

    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Array<Type<any>> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
