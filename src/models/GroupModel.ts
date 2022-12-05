import { DataTypes } from "sequelize";
import db from "../dataAccess/dbConfig";
import UserModel from "./UserModel";

export const Permissions = ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"];

const GroupModel = db.define(
  "Group",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: new DataTypes.STRING(),
    },
    permissions: {
      type: new DataTypes.ARRAY(DataTypes.STRING()),
    },
  },
  {
    tableName: "groups",
    timestamps: false,
  }
);

export default GroupModel;
