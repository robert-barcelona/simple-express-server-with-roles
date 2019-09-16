import validateEmail from "../utils/validate-email";
import User from "../models/User";
import logger from "../utils/logger";

export const logic = {


  async authenticate(email, password) {
    logger.debug(
      `authenticate,  CONTEXT: "logic/index.js", EMAIL:${email}, PASSWORD:${password}`
    );

    const user = await User.findOne({ email }).exec();
    if (!user) throw new LogicError(`user with email ${email} does not exist`);
    if (user.password !== password) throw new LogicError(`wrong password`);
    return user;
  },

  async getUser(email) {
    logger.debug(`getUser,  CONTEXT: "logic/index.js", EMAIL:${email}`);

    const user = await User.findOne({ email }).exec();
    if (!user) throw new LogicError(`user with email ${email} does not exist`);
    return user;
  }
};

export class LogicError extends Error {
  constructor(message) {
    super(message);
  }
}
