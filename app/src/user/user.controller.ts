import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/admin/users")
  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  )
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userService.remove(+id);
  // }
}

// const rawUserForCreate = new CreateUserDto();
// rawUserForCreate.email = body.email;
// rawUserForCreate.password = body.password;
// rawUserForCreate.name = body.name;
// rawUserForCreate.contactPhone = body.contactPhone;
// rawUserForCreate.role = body.role;

// или
// const rawUserForCreate = plainToClass(CreateUserDto, body);

// console.log("rawUserForCreate", rawUserForCreate);

// await validate(rawUserForCreate).then((errors) => {
//   console.log("validation failed. errors: ", errors);
//   res.status(HttpStatus.BAD_REQUEST).json({
//     errors: errors,
//     message: "Validation Errors",
//   });
//   return;
// });
// console.log("after validate");
