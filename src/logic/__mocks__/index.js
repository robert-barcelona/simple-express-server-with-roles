import clients from "../../../data/clients";

class LogicError extends Error {
  constructor(message) {
    super(message);
  }
}

const _validateStringField = value => {
  return typeof value === "string" && value.length;
};

export const getUserForUserName = async name => {
  console.log("hit");
  if (!_validateStringField(name))
    throw new LogicError(`User name ${name} is not valid`);

  const data = clients.filter(client => client.name === name);
  if (data.length === 0)
    throw new LogicError(`user with name ${name} does not exist`);
  return Promise.resolve(data[0]);
};
