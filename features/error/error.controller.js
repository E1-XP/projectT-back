const { errorHandler } = require("./error.service");

exports.catchError = (res) => (err) => {
  errorHandler(err);
  res.status(500).json({ message: "internal server error" });
};
