import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { ID } from "src/types/general";

export class MarkMessagesAsReadDto {
  user?: ID | null;

  supportRequest?: ID;

  @IsDate()
  @Type(() => Date)
  createdBefore: Date;
}
