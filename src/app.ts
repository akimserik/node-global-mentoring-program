import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import groupRoutes from "./routes/groupRoutes";
import authRoutes from "./routes/authRoutes";
import db from "./dataAccess/dbConfig";
import logger from "./utils/logger";
import { globalErrorHandler } from "./utils/errorHandler";

// Uncaught Exception listener
process.on("uncaughtException", err => {
  logger.error("UNCAUGHT EXCEPTION. Shutting down...");
  logger.error(`${err.name}. ${err.message}.`);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server started on port ${port}...`);
});

// App security
app.use(helmet());

// CORS
app.use(cors());

app.use(express.json());

// CONNECT & SYNC DATABASE
db.authenticate()
  .then(() => logger.info("Database connected..."))
  .catch(err => logger.error("Error connecting to database: " + err));

db.sync({ alter: true, logging: false })
  .then(() => logger.info("All models were synchronized successfully."))
  .catch(err => logger.error("Error syncing the database: " + err));

// LOG HTTP REQUESTS
app.use((req: Request, res: Response, next: NextFunction) => {
  const { originalUrl, method, body } = req;
  logger.info(`Request: ${method} ${originalUrl} ${JSON.stringify(body)}`);
  next();
});

// ROUTES
// acceptable routes
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/login", authRoutes);
// other routes
app.all("*", (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server!`;
  logger.error(message);
  res.status(404).json({ message });
});

// ERROR HANDLING
app.use(globalErrorHandler);

// Unhandled promise rejection listener
process.on("unhandledRejection", (err: Error) => {
  logger.info("UNCAUGHT REJECTION. Shutting down...");
  logger.error(`${err.name}. ${err.message}.`);
  server.close(() => {
    process.exit(1);
  });
});
