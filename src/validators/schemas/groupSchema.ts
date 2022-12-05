import { Permissions } from "../../models/GroupModel";
import ajvInstance from "../ajvInstance";

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    permissions: { enum: Permissions },
  },
  required: ["name", "permissions"],
  additionalProperties: false,
};

const groupSchema = ajvInstance.compile(schema);

export { groupSchema };
