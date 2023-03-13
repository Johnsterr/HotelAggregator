import { ID } from "src/types/general";

export class SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}
