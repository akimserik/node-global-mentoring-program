import ajvInstance from "../ajvInstance";

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 1 },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

const authSchema = ajvInstance.compile(schema);

export { authSchema };
