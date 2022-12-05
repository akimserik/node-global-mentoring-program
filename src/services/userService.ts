import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import Sequelize, { Model } from "sequelize";
import UserModel from "../models/UserModel";
import { catchAsync, DataError } from "../utils/errorHandler";

const Op = Sequelize.Op;

interface createUpdateUserRequestBody {
  login: string;
  password: string;
  age: number;
}

// create new user
export const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { login, password, age } = req.body as createUpdateUserRequestBody;

  const newUser = await UserModel.create({
    id: uuidv4(),
    login,
    password,
    age,
  });
  if (newUser) {
    res.status(201).json({
      message: "Created new user.",
      createdUser: newUser,
    });
  } else {
    throw new DataError(`Error creating new user!`, 400);
  }
});

// get all users
export const getUsers: RequestHandler = catchAsync(async (req, res, next) => {
  const allUsers = await UserModel.findAll({
    order: [["id", "asc"]],
    include: [{ all: true }],
  });
  res.json({ users: allUsers });
});

// get one user
export const getUser: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id;
    const user = await UserModel.findByPk(userId);
    if (user) res.json({ user });
    else throw new DataError(`User ${userId} was not found!`, 404);
  }
);

// update user
export const updateUser: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id;
    const updatedUserData = req.body as createUpdateUserRequestBody;

    const user = await UserModel.update(
      {
        ...updatedUserData,
      },
      { where: { id: userId } }
    );
    if (user[0])
      res.status(201).json({ message: `User ${userId} was updated!` });
    else throw new DataError(`User ${userId} was not found!`, 404);
  }
);

// delete user
export const deleteUser: RequestHandler<{ id: string }> = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id;

    const user = await UserModel.update(
      {
        deleted: true,
      },
      { where: { id: userId } }
    );
    if (user[0])
      res.json({ message: `User ${userId} was flagged as deleted!` });
    else throw new DataError(`User ${userId} was not found!`, 404);
  }
);

// get autosuggested users
export const getAutoSuggestedUsers: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { limit, search } = req.query;

    const allUsers = await UserModel.findAll({
      limit: limit ? Number(limit) : undefined,
      order: [["login", "asc"]],
      where: {
        login: { [Op.like]: `%${search}%` },
      },
    });
    res.json({ autoSuggestedUsers: allUsers });
  }
);
