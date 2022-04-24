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

  const filteredData = getUserDataHandler(_id).catch(catchError(res));

  res.status(200).json(filteredData);
};

export const editUserData = function (req, res) {
  const { userid } = req.params;
  const { email, username, avatar, settings } = req.body;

  const data = editUserDataHandler(
    userid,
    email,
    username,
    avatar,
    settings
  ).catch(catchError(res));

  res.status(200).json(data);
};

export const editPassword = function (req, res) {
  const { userid } = req.params;
  const { current, newpass } = req.body;

  const user = editPasswordHandler(userid, current, newpass).catch((err) => {
    if (err.code === 401) res.status(401).json({ result: false });
    else catchError(res)(err);
  });

  if (req.session) req.session.regenerate();
  if (req.persistentSession) req.persistentSession.regenerate();

  req.session.user = user._id;
  res.status(200).json({ result: true });
};

export const uploadAvatar = function (req, res) {
  const { userid } = req.params;

  const data = uploadAvatarHandler(userid, req).catch(catchError(res));

  res.status(200).json(data);
};

export const deleteAvatar = function (req, res) {
  const { userid } = req.params;
  const { avatarURL } = req.body;

  const data = deleteAvatarHandler(userid, avatarURL).catch((err) => {
    if (err.code === 403) return res.status(403).json({ result: false });
    else return catchError(res)(err);
  });

  res.status(200).json(data);
};
