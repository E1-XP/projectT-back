import fs from "fs";
import path from "path";
import formidable from "formidable";
import bcrypt from "bcryptjs";

import * as db from "../../models.js";
import { config } from "../../config/index.js";
import { filterEntries } from "../entries/entry.service.js";
import { throwError } from "../error/error.service.js";

export const getUserDataHandler = async function (userId) {
  const user = await db.User.findOne({ _id: userId });

  const data = await populateEntries(user);
  data.entries = filterEntries(data.entries);

  return data;
};

export const editUserDataHandler = async function (
  userId,
  email,
  username,
  avatar,
  settings
) {
  const user = await db.User.findById(userId);

  if (email && email !== user.email) user.email = email;
  if (username && username !== user.username) user.username = username;
  if (avatar === "") {
    user.avatar = avatar;
    removeDir(__dirname + `/../../public/uploads/` + userId);
  }

  user.settings = settings;

  await user.save();

  const userObj = {};

  for (key in user._doc) {
    if (key !== "password" && key !== "entries") userObj[key] = user._doc[key];
  }
  return userObj;
};

export const editPasswordHandler = async function (
  userId,
  currentPass,
  newPass
) {
  const user = await db.User.findById(userId);

  const throwError = () => {
    const err = new Error("User/password combination not found");
    err.code = 401;
    throw err;
  };

  if (!user) throwError();
  else if (bcrypt.compareSync(currentPass, user.password)) {
    user.password = newPass;

    await user.save();
    return user;
  } else throwError();
};

export const uploadAvatarHandler = async function (userId, request) {
  const form = new formidable.IncomingForm();
  const dir = path.join(__dirname + `/../../public/uploads/${userId}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(__dirname + `/../../public/uploads/${userId}`);
  }

  //remove previous avatars
  fs.readdir(dir, (err, files) => {
    if (err) throwError(err.message, 500);

    if (files)
      for (const file of files) {
        fs.unlink(path.join(dir, file), (err) => {
          if (err) throwError(err.message, 500);
        });
      }
  });

  form.parse(request);

  form.on("fileBegin", function (name, file) {
    file.path = __dirname + `/../../public/uploads/${userId}/${file.name}`;
  });

  form.on("file", async function (name, file) {
    const user = db.User.findById(userId);

    user.avatar = `${config.INSTANCE_URL}/uploads/${userId}/${file.name}`;

    await user.save();

    const userObj = {};

    for (key in user._doc) {
      if (key !== "password" && key !== "entries")
        userObj[key] = user._doc[key];
    }

    return userObj;
  });
};

export const deleteAvatarHandler = async function (userId, avatarURL) {
  fs.unlink(`${__dirname}/../../public${avatarURL}`, async (err) => {
    if (err) throwError(err.message, 500);

    const user = await db.User.findById(userId);

    if (!user) return throwError(err.message, 403);

    user.avatar = "";

    await user.save();

    const userObj = {};

    for (key in user._doc) {
      if (key !== "password" && key !== "entries")
        userObj[key] = user._doc[key];
    }

    return userObj;
  });
};

async function populateEntries(user) {
  const foundEntries = await db.TimeEntry.find({ userId: user._id }).sort({
    start: "desc",
  });
  user.entries = foundEntries;

  const data = Object.keys(user._doc).reduce((acc, key) => {
    if (key !== "password") acc[key] = user._doc[key];
    return acc;
  }, {});

  return data;
}

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (entry) {
      const entryPath = path.join(dirPath, entry);

      if (fs.lstatSync(entryPath).isDirectory()) {
        removeDir(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });

    fs.rmdirSync(dirPath);
  }
}
