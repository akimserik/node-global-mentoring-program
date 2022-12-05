import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, json } = format;

const logger = createLogger({
  format: combine(timestamp(), prettyPrint(), json()),
  transports: [new transports.Console()],
});

export default logger;
