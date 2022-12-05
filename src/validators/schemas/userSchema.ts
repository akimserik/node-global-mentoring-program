import ajvInstance from "../ajvInstance";

const schema = {
  type: "object",
  properties: {
    login: { type: "string", minLength: 1 },
    password: { type: "string", pattern: "^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$" },
    age: { type: "integer", minimum: 4, maximum: 130 },
  },
  required: ["login", "password", "age"],
  additionalProperties: false,
};

const userSchema = ajvInstance.compile(schema);

export { userSchema };
