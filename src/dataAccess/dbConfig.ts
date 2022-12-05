import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config({ path: "./config.env" });

const db = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

export default db;
