const fakeLogin = "login";
const fakePassword = "password";
const fakeAge = 20;
const fakeId = "1234";

jest.mock("../../models/UserModel", () => ({
  create: jest.fn().mockImplementation(async (user) => user),
  findAll: jest.fn().mockImplementation(async (user) => user),
  findByPk: jest.fn().mockImplementation(async (user) => user),
  update: jest.fn().mockImplementation(async (user) => [user]),
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue(fakeId),
}));

jest.mock("sequelize", () => ({
  Op: jest.fn().mockReturnValue({}),
}));

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  getAutoSuggestedUsers,
  deleteUser,
} from "../userService";

describe("userService", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockImplementation(() => mockRes),
      json: jest.fn().mockImplementation(() => mockRes),
    };
  });

  describe("createUser", () => {
    const mockReq = {
      body: {
        login: fakeLogin,
        password: fakePassword,
        age: fakeAge,
      },
    };

    it("Should create the user", async () => {
      await createUser(mockReq, mockRes, null);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        createdUser: {
          id: fakeId,
          login: fakeLogin,
          password: fakePassword,
          age: fakeAge,
        },
        message: "Created new user.",
      });
    });
  });

  describe("Get all users", () => {
    it("Should get all users", async () => {
      await getUsers(null, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        users: {
          include: [
            {
              all: true,
            },
          ],
          order: [["id", "asc"]],
        },
      });
    });
  });

  describe("Get one user", () => {
    it("Should get one user", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
      };

      await getUser(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: fakeId,
      });
    });
  });

  describe("Update user", () => {
    it("Should update user", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
        body: {
          login: fakeLogin,
          password: fakePassword,
          age: fakeAge,
        },
      };

      await updateUser(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `User ${fakeId} was updated!`,
      });
    });
  });

  describe("Delete user", () => {
    it("Should delete user", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
      };

      await deleteUser(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `User ${fakeId} was flagged as deleted!`,
      });
    });
  });

  describe("Get autosuggested users", () => {
    it("Should get autosuggested users", async () => {
      const mockReq = {
        query: {
          limit: 5,
          search: "a",
        },
      };

      await getAutoSuggestedUsers(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        autoSuggestedUsers: {
          limit: 5,
          order: [["login", "asc"]],
          where: {
            login: {
              ["undefined"]: "%a%",
            },
          },
        },
      });
    });
  });
});
