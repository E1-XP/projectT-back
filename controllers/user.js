const db = require("../models");

const errorHandler = require("./../services/error");
const {
  getUserDataHandler,
  editUserDataHandler,
  editPasswordHandler,
  uploadAvatarHandler,
  deleteAvatarHandler,
} = require("../services/user");
const { catchError } = require("./helpers");

exports.getUserData = function (req, res) {
  const _id = req.session.user || req.persistentSession.user;

  const respondWithFilteredData = (filteredData) =>
    res.status(200).json(filteredData);

  getUserDataHandler(_id, respondWithFilteredData, catchError);
};

exports.editUserData = function (req, res) {
  const { userid } = req.params;
  const { email, username, avatar, settings } = req.body;

  const respondWithUserData = (data) => res.status(200).json(data);

  editUserDataHandler(
    userid,
    email,
    username,
    avatar,
    settings,
    respondWithUserData,
    catchError(res)
  );
};

exports.editPassword = function (req, res) {
  const { userid } = req.params;
  const { current, newpass } = req.body;

  const noUserOrPasswordFoundResponse = () =>
    res.status(401).json({ result: false });

  const refreshSessionAndRespond = (user) => {
    if (req.session) req.session.regenerate();
    if (req.persistentSession) req.persistentSession.regenerate();

    req.session.user = user._id;
    res.status(200).json({ result: true });
  };

  editPasswordHandler(
    userid,
    current,
    newpass,
    noUserOrPasswordFoundResponse,
    refreshSessionAndRespond,
    catchError(res)
  );
};

exports.uploadAvatar = function (req, res) {
  const { userid } = req.params;

  const respondWithUserData = (data) => res.status(200).json(data);

  uploadAvatarHandler(userid, respondWithUserData, catchError(res));
};

exports.deleteAvatar = function (req, res) {
  const { userid } = req.params;
  const { avatarURL } = req.body;

  const respondWithUserData = (data) => res.status(200).json(data);
  const respondWithNoUserFound = () => res.status(403).json({ result: false });

  deleteAvatarHandler(
    userid,
    avatarURL,
    respondWithUserData,
    respondWithNoUserFound,
    catchError(res)
  );
};
