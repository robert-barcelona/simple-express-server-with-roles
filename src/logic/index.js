import validateEmail from "../utils/validate-email";
import Client from "../models/Client";
import Policy from "../models/Policy";
import logger from "../utils/logger";

export const logic = {
  _validateStringField(value) {
    return typeof value === "string" && value.length;
  },

  async authenticate(email, password) {
    logger.debug(
      `authenticate,  CONTEXT: "logic/index.js", EMAIL:${email}, PASSWORD:${password}`
    );
    if (!validateEmail(email))
      throw new LogicError(`Email ${email} is not valid`);
    if (!this._validateStringField(password))
      throw new LogicError(`Password ${email} is not a valid string`);
    const user = await Client.findOne({ email }, { _id: 0, __v: 0 }).exec();
    if (!user) throw new LogicError(`user with email ${email} does not exist`);
    if (user.password !== password) throw new LogicError(`wrong password`);
    return user;
  },

  async getUser(email) {
    logger.debug(`getUser,  CONTEXT: "logic/index.js", EMAIL:${email}`);
    if (!validateEmail(email))
      throw new LogicError(`Email ${email} is not valid`);

    const user = await Client.findOne({ email }, { _id: 0, __v: 0 }).exec();
    if (!user) throw new LogicError(`user with email ${email} does not exist`);
    return user;
  },

  async getPoliciesForUserName(name) {
    logger.debug(
      `getUserForUserName,  CONTEXT: "logic/index.js", NAME:${name}`
    );
    if (!this._validateStringField(name))
      throw new LogicError(`User name ${name} is not valid`);
    const user = await Client.findOne(
      {
        name: { $regex: new RegExp(name, "i") }
      },
      { _id: 0, __v: 0 }
    ).exec();
    if (!user) throw new LogicError(`user with name ${name} does not exist`);
    const policies = await Policy.find(
      { clientId: user.id },
      { _id: 0, __v: 0 }
    ).exec();
    logger.debug(
      `getUserForUserName,  CONTEXT: "logic/index.js", User:${user},POLICIES:${policies}`
    );
    return policies;
  },

  async getUserForUserName(name) {
    logger.debug(
      `getUserForUserName,  CONTEXT: "logic/index.js", NAME:${name}`
    );
    if (!this._validateStringField(name))
      throw new LogicError(`User name ${name} is not valid`);
    const user = await Client.findOne(
      {
        name: { $regex: new RegExp(name, "i") }
      },
      { _id: 0, __v: 0 }
    ).exec();

    if (!user) throw new LogicError(`user with name ${name} does not exist`);
    return user;
  },

  async getUserForPolicyNumber(policyNumber) {
    logger.debug(
      `getUserForPolicyNumber,  CONTEXT: "logic/index.js", POLICYNUMBER:${policyNumber}`
    );
    if (!this._validateStringField(policyNumber))
      throw new LogicError(`policyNumber ${policyNumber} is not valid`);
    const id = +policyNumber;
    const policy = await Policy.findOne({ id }, { _id: 0, __v: 0 }).exec();
    if (!policy)
      throw new LogicError(`policy number ${policyNumber} does not exist`);
    const user = await Client.findOne(
      { id: policy.clientId },
      { _id: 0, __v: 0 }
    ).exec();
    return user;
  },

  async getUserForUserId(id) {
    logger.debug(`getUserForUserId,  CONTEXT: "logic/index.js", ID:${id}`);
    if (!this._validateStringField(id))
      throw new LogicError(`User ID ${id} is not valid`);
    const user = await Client.findOne({ id }, { _id: 0, __v: 0 }).exec();

    if (!user) throw new LogicError(`user with id ${id} does not exist`);
    return user;
  }
};

export class LogicError extends Error {
  constructor(message) {
    super(message);
  }
}
