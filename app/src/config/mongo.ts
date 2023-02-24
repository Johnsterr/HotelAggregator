import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export const buildMongoConfig = async (
  ConfigService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoString(ConfigService),
    ...getMongoOptions(),
  };
};

const getMongoString = (ConfigService: ConfigService) => {
  const MONGO_HOST = ConfigService.get("MONGO_HOST");
  const MONGO_PORT = ConfigService.get("MONGO_PORT");
  const USERNAME = ConfigService.get("MONGO_INITDB_ROOT_USERNAME");
  const USER_PASSWORD = ConfigService.get("MONGO_INITDB_ROOT_PASSWORD");
  const MONGO_DATABASE = ConfigService.get("MONGO_INITDB_DATABASE");

  /* query mongo params
  // ?retryWrites=true&w=majority
  */
  //const uri = `mongodb://${USERNAME}:${USER_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
  const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/`;
  return uri;
};

const getMongoOptions = () => ({
  //useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});
