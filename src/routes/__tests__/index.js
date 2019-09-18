jest.mock("../../logic");
import { getUserForUserName } from "../../logic/__mocks__";

describe("getUserForUserName", () => {
  const name = "Ines";
  it("gets correct data for user name", async () => {
    const data = await getUserForUserName(name);
    expect(data).toEqual({
      email: "inesblankenship@quotezart.com",
      id: "4a0573eb-56d0-45d5-ab36-bebf33c5eb36",
      name,
      role: "admin"
    });
  });

  it("to throw with missing name", async () => {
    const name = "";
    await expect(getUserForUserName(name)).rejects.toThrow(
      `User name ${name} is not valid`
    );
  });

  it("to throw with undefined", async () => {
    const name = undefined;
    await expect(getUserForUserName(name)).rejects.toThrow(
      `User name ${name} is not valid`
    );
  });
  it("to throw with null", async () => {
    const name = null;
    await expect(getUserForUserName(name)).rejects.toThrow(
      `User name ${name} is not valid`
    );
  });
  it("to throw with number", async () => {
    const name = 12;
    await expect(getUserForUserName(name)).rejects.toThrow(
      `User name ${name} is not valid`
    );
  });

  it("to throw if user doesn't exist", async () => {
    const name = "Hans";
    await expect(getUserForUserName(name)).rejects.toThrow(
      `user with name ${name} does not exist`
    );
  });
});
