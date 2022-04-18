import * as db from "../../models.js";
import { catchError } from "../error/error.controller.js";

import {
  getUserDataHandler,
  editUserDataHandler,
  editPasswordHandler,
  uploadAvatarHandler,
  deleteAvatarHandler,
} from "./user.service.js";

export const getUserData = function (req, res) {
  const _id = req.session.user || req.persistentSession.user;

  const respondWithFilteredData = (filteredData) =>
    res.status(200).json(filteredData);

  getUserDataHandler(_id, respondWithFilteredData, catchError);
};

export const editUserData = function (req, res) {
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

export const editPassword = function (req, res) {
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

export const uploadAvatar = function (req, res) {
  const { userid } = req.params;

  const respondWithUserData = (data) => res.status(200).json(data);

  uploadAvatarHandler(userid, req, respondWithUserData, catchError(res));
};

export const deleteAvatar = function (req, res) {
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
