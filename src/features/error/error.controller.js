import { errorHandler } from "./error.service.js";

export const catchError = (res) => (err) => {
  errorHandler(err);
  res.status(500).json({ message: "internal server error" });
};
