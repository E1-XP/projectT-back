const db = require("../models");

const { getUserData } = require("./../controllers/user");

const {
  signUpHandler,
  loginHandler,
  refreshHandler,
} = require("./../services/auth");
const validateUser = require("./../services/validateUser");
const { errorHandler } = require("./../services/error");
const { catchError } = require("./helpers");

exports.signup = function (req, res) {
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

exports.login = function (req, res) {
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

exports.logout = function (req, res) {
  if (req.session)
    req.session.destroy((err) => {
      if (err) {
        catchError(res)(err);
      } else res.status(200).json({ message: "success" });
    });
};

exports.refresh = function (req, res) {
  if (req.session.user) {
    const id = req.session.user;

    const userPasswordNotFoundResponse = () =>
      res.status(401).json({
        message: "user/password combination not found",
      });

    refreshHandler(
      id,
      userPasswordNotFoundResponse,
      getUserData,
      catchError(res)
    );
  } else
    res.status(401).json({ message: "user/password combination not found" });
};
