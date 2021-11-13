const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const loginUser = require("./userController");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a loginUser function", () => {
  describe("When it receives a incorrect username", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });

  describe("When it receives a correct username and incorrect password", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "addmin",
        password: "admmin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const next = jest.fn();
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      };
      const expectedError = new Error("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives a correct username and a correct password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "admin",
        password: "admin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "someExpectedToken";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const res = {
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "admin",
          password: "admin",
        },
      };
      const expectedResponse = {
        token: expectedToken,
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
