import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Controller("api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/admin/users")
  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  )
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Get("/admin/users")
  findAll(
    @Query("email") email?,
    @Query("limit") limit?,
    @Query("offset") offset?,
    @Query("name") name?,
    @Query("contactPhone") contactPhone?,
  ): Promise<User[]> {
    limit = limit ? parseInt(limit) : 0;
    offset = offset ? parseInt(offset) : 0;

    const params = { email, limit, offset, name, contactPhone };

    return this.userService.findAll(params);
  }

  @Get("/manager/users")
  findAllUsers(
    @Query("email") email?,
    @Query("limit") limit?,
    @Query("offset") offset?,
    @Query("name") name?,
    @Query("contactPhone") contactPhone?,
  ): Promise<User[]> {
    limit = limit ? parseInt(limit) : 0;
    offset = offset ? parseInt(offset) : 0;

    const params = { email, limit, offset, name, contactPhone };

    return this.userService.findAll(params);
  }

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
