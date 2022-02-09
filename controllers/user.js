const db = require("../models");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

const { ORIGIN_URL } = require("./../config");

const filterEntries = require("./../services/filterEntries");

exports.getUserData = function (req, res) {
  const _id = req.session.user || req.persistentSession.user;

  db.User.findOne({ _id })
    .then((user) => {
      populateEntries(user)
        .then((data) => {
          data.entries = filterEntries(data.entries);
          return data;
        })
        .then((filteredData) => res.status(200).json(filteredData))
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(400).json({ message: "internal server error" }));
};

exports.editUserData = function (req, res) {
  const { userid } = req.params;

  db.User.findById(userid)
    .then((user) => {
      if (req.body.email && req.body.email !== user.email)
        user.email = req.body.email;
      if (req.body.username && req.body.username !== user.username)
        user.username = req.body.username;
      if (req.body.avatar === "") {
        user.avatar = req.body.avatar;
        removeDir(__dirname + `/../public/uploads/` + userid);
      }
      user.settings = req.body.settings;

      user
        .save()
        .then(() => {
          const userObj = {};

          for (key in user._doc) {
            if (key !== "password" && key !== "entries")
              userObj[key] = user._doc[key];
          }
          res.status(200).json(userObj);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.editPassword = function (req, res) {
  const { userid } = req.params;
  const { current, newpass } = req.body;

  db.User.findById(userid)
    .then((user) => {
      if (!user) return res.status(401).json({ result: false });
      else if (bcrypt.compareSync(current, user.password)) {
        user.password = newpass;

        user
          .save()
          .then(() => {
            if (req.session) req.session.regenerate();
            if (req.persistentSession) req.persistentSession.regenerate();

            req.session.user = user._id;
            res.status(200).json({ result: true });
          })
          .catch((err) => console.log(err));
      } else res.status(401).json({ result: false });
    })
    .catch((err) => console.log(err));
};

exports.upload = function (req, res) {
  const { userid } = req.params;

  const form = new formidable.IncomingForm();
  const dir = path.join(__dirname + `/../public/uploads/${userid}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(__dirname + `/../public/uploads/${userid}`);
  }

  //remove previous avatars
  fs.readdir(dir, (err, files) => {
    if (err) console.log(err);

    if (files)
      for (const file of files) {
        fs.unlink(path.join(dir, file), (err) => {
          if (err) console.log(err);
        });
      }
  });

  form.parse(req);

  form.on("fileBegin", function (name, file) {
    file.path = __dirname + `/../public/uploads/${userid}/${file.name}`;
  });

  form.on("file", function (name, file) {
    db.User.findById(userid).then((user) => {
      user.avatar = `${app.ORIGIN_URL[1]}/uploads/${userid}/${file.name}`;

      user
        .save()
        .then(() => {
          const userObj = {};

          for (key in user._doc) {
            if (key !== "password" && key !== "entries" && key !== "settings")
              userObj[key] = user._doc[key];
          }
          res.status(200).json(userObj);
        })
        .catch((err) => console.log(err));
    });
  });
};

function populateEntries(user) {
  return new Promise(function (res, rej) {
    db.TimeEntry.find({ userId: user._id })
      .sort({ start: "desc" })
      .then((foundEntries) => {
        user.entries = foundEntries;

        const data = Object.keys(user._doc).reduce((acc, key) => {
          if (key !== "password") acc[key] = user._doc[key];
          return acc;
        }, {});

        res(data);
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
