import * as db from "./models.js";

export const loginRequired = function (req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else res.status(401).json({ message: "authentication required" });
};
