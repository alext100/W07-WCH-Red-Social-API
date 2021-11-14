const User = require("../../database/models/user");
const { getUsers, deleteUser, updateUser } = require("./usersController");

describe("Given getUsers function", () => {
  describe("When it receives an object res", () => {
    test("Then it should invoke the method json", async () => {
      const users = [
        {
          name: "Alexandr",
          username: "Alex",
          image:
            "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-14.png",
          password:
            "$2b$10$F2jZvDXLqi.SG4RAnqiaJuwNvyqRaCT60otwa542PFLY50l7tMdGK",
          friends: [],
          enemies: [],
          age: 30,
          id: "61914a9010b72b06d95d5677",
        },

        {
          name: "Peter",
          username: "Peter",
          image:
            "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-14.png",
          password:
            "$2b$10$F2jZvDXLqi.SG4RAnqiaJuwNvyqRaCT60otwa542PFLY50l7tMdGK",
          friends: [],
          enemies: [],
          age: 20,
          id: "61914a9010b72b06d95d1234",
        },

        {
          name: "Maria",
          username: "Maria",
          image:
            "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-14.png",
          password:
            "$2b$10$F2jZvDXLqi.SG4RAnqiaJuwNvyqRaCT60otwa542PFLY50l7tMdGK",
          friends: [],
          enemies: [],
          age: 33,
          id: "61934a9010b72b06d95d5634",
        },
      ];
      User.find = jest.fn().mockResolvedValue(users);
      const res = {
        json: jest.fn(),
      };

      await getUsers(null, res);

      expect(User.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });
});

describe("Given an updateUser function", () => {
  describe("When it receives a non existent user", () => {
    test("Then it should invoke a next function with a 404 error", async () => {
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          id: "6188d83ee45c3a8801f1120d",
        },
      };
      const next = jest.fn();
      const expectedError = {
        code: 404,
        message: "User not found",
      };

      await updateUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives an existent user", () => {
    test("Then it should invoke res.json() with the updated user", async () => {
      const updatedUser = {
        id: "6188d83be45c3a8801f1270c",
        name: "Maria",
        age: 26,
      };
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);
      const req = {
        body: {
          id: "6188d83be45c3a8801f1270c",
        },
      };
      const res = {
        json: jest.fn(),
      };

      await updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });
});

describe("Given a deleteUser function", () => {
  describe("When it receives a request with an id", () => {
    test("Then it should invoke a User.findByIdAndDelete with the id", async () => {
      User.findByIdAndDelete = jest.fn().mockResolvedValue({});
      const id = "61914a9010b72b06d95d5677";
      const req = {
        params: {
          id,
        },
      };
      const res = {
        json: () => {},
      };
      const next = () => {};

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe("And Robot.findByIdAndDelete rejects", () => {
    test("Then it should invoke next function with the error rejected", async () => {
      const expectedError = new Error("Error on delete the user");
      User.findByIdAndDelete = jest.fn().mockRejectedValue(expectedError);
      const req = {
        params: {
          id: 0,
        },
      };
      const res = {};
      const next = jest.fn();

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
