import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ID } from "src/types/general";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, id?: ID) => void): void {
    //console.log("\nSerialized User:\n", user);
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: any, id?: ID) => void): void {
    //console.log("\nDeserialized Payload:\n", payload);
    done(null, payload);
  }
}
