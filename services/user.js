const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

const db = require("../models");

const { INSTANCE_URL } = require("./../config");

const { filterEntries } = require("./entries");

exports.getUserDataHandler = function (
  userId,
  respondWithFilteredData,
  catchError
) {
  db.User.findOne({ _id: userId })
    .then((user) => {
      populateEntries(user)
        .then((data) => {
          data.entries = filterEntries(data.entries);
          return data;
        })
        .then((data) => respondWithFilteredData(data))
        .catch((err) => catchError(err));
    })
    .catch((err) => catchError(err));
};

exports.editUserDataHandler = function (
  userId,
  email,
  username,
  avatar,
  settings,
  respondWithUserData,
  catchError
) {
  db.User.findById(userId)
    .then((user) => {
      if (email && email !== user.email) user.email = email;
      if (username && username !== user.username) user.username = username;
      if (avatar === "") {
        user.avatar = avatar;
        removeDir(__dirname + `/../public/uploads/` + userId);
      }

      user.settings = settings;

      user
        .save()
        .then(() => {
          const userObj = {};

          for (key in user._doc) {
            if (key !== "password" && key !== "entries")
              userObj[key] = user._doc[key];
          }
          respondWithUserData(userObj);
        })
        .catch((err) => catchError(err));
    })
    .catch((err) => catchError(err));
};

exports.editPasswordHandler = function (
  userId,
  currentPass,
  newPass,
  noUserOrPasswordFoundResponse,
  refreshSessionAndRespond,
  catchError
) {
  db.User.findById(userId)
    .then((user) => {
      if (!user) return noUserOrPasswordFoundResponse();
      else if (bcrypt.compareSync(currentPass, user.password)) {
        user.password = newPass;

        user
          .save()
          .then(() => refreshSessionAndRespond(user))
          .catch((err) => catchError(err));
      } else noUserOrPasswordFoundResponse();
    })
    .catch((err) => catchError(err));
};

exports.uploadAvatarHandler = function (
  userId,
  respondWithUserData,
  catchError
) {
  const form = new formidable.IncomingForm();
  const dir = path.join(__dirname + `/../public/uploads/${userId}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(__dirname + `/../public/uploads/${userId}`);
  }

  //remove previous avatars
  fs.readdir(dir, (err, files) => {
    if (err) console.log(err);

    if (files)
      for (const file of files) {
        fs.unlink(path.join(dir, file), (err) => {
          if (err) catchError(err);
        });
      }
  });

  form.parse(req);

  form.on("fileBegin", function (name, file) {
    file.path = __dirname + `/../public/uploads/${userId}/${file.name}`;
  });

  form.on("file", function (name, file) {
    db.User.findById(userId)
      .then((user) => {
        user.avatar = `${INSTANCE_URL}/uploads/${userId}/${file.name}`;

        user
          .save()
          .then(() => {
            const userObj = {};

            for (key in user._doc) {
              if (key !== "password" && key !== "entries" && key !== "settings")
                userObj[key] = user._doc[key];
            }
            respondWithUserData(userObj);
          })
          .catch((err) => catchError(err));
      })
      .catch((err) => catchError(err));
  });
};

exports.deleteAvatarHandler = function (
  userId,
  avatarURL,
  respondWithUserData,
  respondWithNoUserFound,
  catchError
) {
  fs.unlink(`${__dirname}/../public${avatarURL}`, (err) => {
    if (err) {
      catchError(err);
    }

    db.User.findById(userId)
      .then((user) => {
        if (!user) return respondWithNoUserFound();

        user.avatar = "";

        user
          .save()
          .then(() => {
            const userObj = {};

            for (key in user._doc) {
              if (key !== "password" && key !== "entries" && key !== "settings")
                userObj[key] = user._doc[key];
            }
            respondWithUserData(userObj);
          })
          .catch((err) => catchError(err));
      })
      .catch((err) => catchError(err));
  });
};

function populateEntries(user) {
  return new Promise(function (resolve, reject) {
    db.TimeEntry.find({ userId: user._id })
      .sort({ start: "desc" })
      .then((foundEntries) => {
        user.entries = foundEntries;

        const data = Object.keys(user._doc).reduce((acc, key) => {
          if (key !== "password") acc[key] = user._doc[key];
          return acc;
        }, {});

        resolve(data);
      });
  });
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
