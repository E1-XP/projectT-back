const { errorHandler } = require("./../services/error");

exports.catchError = (res) => (err) => {
  errorHandler(err);
  res.status(500).json({ message: "internal server error" });
};
