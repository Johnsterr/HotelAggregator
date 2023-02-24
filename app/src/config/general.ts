import { ConfigModule } from "@nestjs/config";

export async function isDevelopmentMode() {
  await ConfigModule.envVariablesLoaded;
  return process.env.NODE_ENV === "development" ? true : false;
}
