import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel, { UserType } from "../models/UserModel";
import { AuthError, catchAsync } from "../utils/errorHandler";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: UserType, statusCode: number, res: Response) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: "success",
    data: {
      user: user.id,
    },
    token,
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ where: { login: username } });

  // Check if user exists && password is correct
  if (!user || user.getDataValue("password") !== password) {
    return next(new AuthError("Invalid login or password", 401));
  }

  if (user.getDataValue("deleted")) {
    return next(new AuthError("User is deleted", 401));
  }

  // If OK, send token to Client
  createSendToken(user.get(), 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Check if token is in the request
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AuthError("You are not logged in. Please log in to get access", 401)
    );
  }

  // 2) Verify token
  jwt.verify(token, process.env.JWT_SECRET || "", async (err, decoded) => {
    if (err) {
      return next(
        new AuthError("Failed to authenticate token! Please login again.", 403)
      );
    }
  });

  next();
});
