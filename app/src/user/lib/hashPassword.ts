import { genSalt, hash } from "bcrypt";

export const hashPassword = async function (passwordToHash: string) {
  const sault = await genSalt(10);
  return await hash(passwordToHash, sault);
};
