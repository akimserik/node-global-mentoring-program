import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import Sequelize from "sequelize";
import GroupModel from "../models/GroupModel";
import UserGroupModel from "../models/UserGroupModel";
import db from "../dataAccess/dbConfig";
import { catchAsync, DataError } from "../utils/errorHandler";

const Op = Sequelize.Op;

interface createUpdateGroupRequestBody {
  name: string;
  permissions: string;
}

interface addUserToGroupRequestBody {
  groupId: string;
  userIds: Array<string>;
}

// create new group
export const createGroup: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { name, permissions } = req.body as createUpdateGroupRequestBody;

    const newGroup = await GroupModel.create({
      id: uuidv4(),
      name,
      permissions: [permissions],
    });

    if (newGroup) {
      res
        .status(201)
        .json({ message: "Created new group.", createdGroup: newGroup });
    } else {
      throw new DataError(`Error creating new group!`, 400);
    }
  }
);

// get all groups
export const getGroups: RequestHandler = catchAsync(async (req, res, next) => {
  const allGroups = await GroupModel.findAll({
    order: [["id", "asc"]],
    include: [{ all: true }],
  });
  res.json({ groups: allGroups });
});

// get one group
export const getGroup: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const groupId = req.params.id;
    const group = await GroupModel.findByPk(groupId);
    if (group) res.json({ group });
    else throw new DataError(`Group ${groupId} was not found!`, 404);
  }
);

// update group
export const updateGroup: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const groupId = req.params.id;
    const { name, permissions } = req.body as createUpdateGroupRequestBody;

    const group = await GroupModel.update(
      {
        name,
        permissions: Sequelize.fn(
          "array_append",
          Sequelize.col("permissions"),
          permissions
        ),
      },
      { where: { id: groupId } }
    );
    if (group[0]) res.json({ message: `Group ${groupId} was updated!` });
    else throw new DataError(`Group ${groupId} was not found!`, 404);
  }
);

// delete group
export const deleteGroup: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const groupId = req.params.id;
    const group = await GroupModel.destroy({ where: { id: groupId } });
    if (group) res.json({ message: `Group ${groupId} was deleted!` });
    else throw new DataError(`Group ${groupId} was not found!`, 404);
  }
);

// add users to group
export const addUsersToGroup: RequestHandler = async (req, res, next) => {
  const { groupId, userIds } = req.body as addUserToGroupRequestBody;
  const t = await db.transaction();

  try {
    for (const userId of userIds) {
      await UserGroupModel.create(
        {
          UserId: userId,
          GroupId: groupId,
        },
        { transaction: t }
      );
    }
    await t.commit();
    res.status(201).json({ message: `Users were added to group!` });
  } catch (error) {
    await t.rollback();
    throw new DataError(`Error adding users to group!`, 400);
  }
};
