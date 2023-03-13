import { ID } from "src/types/general";

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}
