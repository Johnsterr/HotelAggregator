import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";
import { publicFolderPath } from "./main";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    return !!process.env.IS_DEV
      ? res.sendFile(`${publicFolderPath}/index.html`)
      : res.send(this.appService.getHello());
  }
}
