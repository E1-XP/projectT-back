import * as db from "../../models.js";

import { signUpHandler, loginHandler, refreshHandler } from "./auth.service.js";
import { validateUser } from "../validation/validation.service.js";
import { getUserDataHandler } from "../user/user.service.js";
import { catchError } from "../error/error.controller.js";

export const signup = function (req, res) {
  const { email, username, password } = req.body;
  const userData = { email, username, password };

  if (!validateUser(req.body))
    return res.status(401).json({
      message: "invalid data provided",
    });

  const data = signUpHandler(userData).catch((err) => {
    if (err.code === 11000)
      return res.status(409).json({
        message: "user with same email or/and username already exist",
      });
    else return catchError(res)(err);
  });

  req.session.user = data._id;

  res.status(200).json(data);
};

export const login = function (req, res) {
  const { email, password } = req.body;

  if (!validateUser(req.body))
    return res.status(401).json({
      message: "invalid data provided",
    });

  const userData = loginHandler(email, password).catch((err) => {
    if (err.code === 401) {
      return res.status(401).json({
        message: "User/password combination not found",
      });
    } else return catchError(res)(err);
  });

  req.session.user = userData._id;

  res.status(200).json({
    message: "success",
    userId: userData._id,
  });
};

export const logout = function (req, res) {
  if (req.session)
    req.session.destroy((err) => {
      if (err) {
        catchError(res)(err);
      } else res.status(200).json({ message: "success" });
    });
};

export const refresh = function (req, res) {
  const userPasswordNotFoundResponse = () =>
    res.status(401).json({
      message: "user/password combination not found",
    });

  if (req.session.user) {
    const id = req.session.user;

    const data = refreshHandler(id).catch((err) => {
      if (err.code === 401) {
        return userPasswordNotFoundResponse();
      }
    });

    res.status(200).json(data);
  } else userPasswordNotFoundResponse();
};
