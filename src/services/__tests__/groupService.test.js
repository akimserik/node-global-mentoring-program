const fakeId = "1";
const fakeName = "Group1";
const fakePermissions = ["READ"];
const fakeUserIds = ["1", "2"];

jest.mock("../../models/UserModel", () => ({
  belongsToMany: jest.fn().mockImplementation(async (user) => user),
}));

jest.mock("../../models/GroupModel", () => ({
  create: jest.fn().mockImplementation(async (group) => group),
  findAll: jest.fn().mockImplementation(async (group) => group),
  findByPk: jest.fn().mockImplementation(async (group) => group),
  update: jest.fn().mockImplementation(async (group) => [group]),
  destroy: jest.fn().mockImplementation(async (group) => group),
  belongsToMany: jest.fn().mockImplementation(async (group) => group),
}));

jest.mock("../../models/UserGroupModel", () => ({
  create: jest.fn().mockImplementation(async (userGroup) => userGroup),
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue(fakeId),
}));

jest.mock("../../dataAccess/dbConfig", () => ({
  transaction: jest.fn().mockReturnValue({
    commit: jest.fn().mockReturnValue(null),
    rollback: jest.fn().mockReturnValue(null),
  }),
}));

import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addUsersToGroup,
} from "../groupService";

describe("groupService", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockImplementation(() => mockRes),
      json: jest.fn().mockImplementation(() => mockRes),
    };
  });

  describe("createGroup", () => {
    const mockReq = {
      body: {
        name: fakeName,
        permissions: fakePermissions,
      },
    };

    it("Should create the group", async () => {
      await createGroup(mockReq, mockRes, null);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        createdGroup: {
          id: fakeId,
          name: fakeName,
          permissions: [fakePermissions],
        },
        message: "Created new group.",
      });
    });
  });

  describe("Get all groups", () => {
    it("Should get all groups", async () => {
      await getGroups(null, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        groups: {
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

  describe("Get one group", () => {
    it("Should get one group", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
      };

      await getGroup(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        group: fakeId,
      });
    });
  });

  describe("Update group", () => {
    it("Should update group", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
        body: {
          name: fakeName,
          permissions: [fakePermissions],
        },
      };

      await updateGroup(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `Group ${fakeId} was updated!`,
      });
    });
  });

  describe("Delete group", () => {
    it("Should delete group", async () => {
      const mockReq = {
        params: {
          id: fakeId,
        },
      };

      await deleteGroup(mockReq, mockRes, null);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `Group ${fakeId} was deleted!`,
      });
    });
  });

  describe("addUsersToGroup", () => {
    const mockReq = {
      body: {
        groupId: fakeId,
        userIds: [fakeUserIds],
      },
    };

    it("Should add users to the group", async () => {
      await addUsersToGroup(mockReq, mockRes, null);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Users were added to group!",
      });
    });
  });
});
