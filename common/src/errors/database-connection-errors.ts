import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super("Error connecting to DB");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors = () => {
    return [{ message: "Error connecting to DB" }];
  };
}
