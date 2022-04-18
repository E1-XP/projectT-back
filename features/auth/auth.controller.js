import * as db from "../../models.js";

import { signUpHandler, loginHandler, refreshHandler } from "./auth.service.js";
import { validateUser } from "../validation/validation.service.js";
import { errorHandler } from "../error/error.service.js";
import { getUserDataHandler } from "../user/user.service.js";
import { catchError } from "../error/error.controller.js";

export const signup = function (req, res) {
  const { email, username, password } = req.body;
  const userData = { email, username, password };

  if (!validateUser(req.body))
    return res.status(401).json({
      message: "invalid data provided",
    });

  const setSessionVariable = (data) => (req.session.user = data);
  const respondWithData = (data) => res.status(200).json(data);

  const catchError = (err) => {
    errorHandler(err);

    if (err.code === 11000)
      res.status(409).json({
        message: "user with same email or/and username already exist",
      });
    else res.status(500).json({ message: "internal server error" });
  };

  signUpHandler(userData, setSessionVariable, respondWithData, catchError);
};

export const login = function (req, res) {
  const { email, password } = req.body;

  if (!validateUser(req.body))
    return res.status(401).json({
      message: "invalid data provided",
    });

  const userPasswordNotFoundResponse = () =>
    res.status(401).json({
      message: "user/password combination not found",
    });

  const setSessionVariable = (data) => (req.session.user = data);

  const respondWithSuccess = (user) => {
    res.status(200).json({
      message: "success",
      userId: user._id,
    });
  };

  loginHandler(
    email,
    password,
    userPasswordNotFoundResponse,
    setSessionVariable,
    respondWithSuccess,
    catchError(res)
  );
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
  if (req.session.user) {
    const id = req.session.user;

    const userPasswordNotFoundResponse = () =>
      res.status(401).json({
        message: "user/password combination not found",
      });

    const respondWithFilteredData = (filteredData) =>
      res.status(200).json(filteredData);

    refreshHandler(
      id,
      userPasswordNotFoundResponse,
      getUserDataHandler,
      respondWithFilteredData,
      catchError(res)
    );
  } else
    res.status(401).json({ message: "user/password combination not found" });
};
