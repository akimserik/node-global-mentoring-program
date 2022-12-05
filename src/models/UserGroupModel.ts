import { DataTypes } from "sequelize";
import db from "../dataAccess/dbConfig";
import GroupModel from "./GroupModel";
import UserModel from "./UserModel";

const UserGroupModel = db.define(
  "UserGroup",
  {
    UserId: {
      type: DataTypes.STRING,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    GroupId: {
      type: DataTypes.STRING,
      references: {
        model: GroupModel,
        key: "id",
      },
    },
  },
  {
    tableName: "usergroups",
    timestamps: false,
  }
);

GroupModel.belongsToMany(UserModel, { through: UserGroupModel });
UserModel.belongsToMany(GroupModel, { through: UserGroupModel });

export default UserGroupModel;
