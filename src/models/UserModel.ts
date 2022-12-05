import { DataTypes } from "sequelize";
import db from "../dataAccess/dbConfig";

export interface UserType {
  id: string;
  login: string;
  password: string;
}

const UserModel = db.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    login: {
      type: new DataTypes.STRING(),
    },
    password: {
      type: new DataTypes.STRING(),
    },
    age: {
      type: new DataTypes.INTEGER(),
    },
    deleted: {
      type: new DataTypes.BOOLEAN(),
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default UserModel;
