import { ObjectId } from "mongoose";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export type ID = string | ObjectId;

export class SearchBaseParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
