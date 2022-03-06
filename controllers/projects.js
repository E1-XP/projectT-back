const db = require("../models");

const errorHandler = require("./../services/error");

exports.new = function (req, res) {
  const { userid } = req.params;
  const { name, color, client } = req.query;

  db.User.findById(userid)
    .then(function (user) {
      const projects = user.projects.length ? user.projects.slice() : [];

      projects.push({ name, color, client });
      user.projects = projects;

      user
        .save()
        .then(function () {
          db.User.findById(userid)
            .then((user) => {
              const data = Object.keys(user._doc).reduce((acc, key) => {
                key !== "password" && key !== "entries"
                  ? (acc[key] = user._doc[key])
                  : null;
                return acc;
              }, {});

              res.status(200).json(data);
            })
            .catch((err) => {
              errorHandler(err);
              res.status(500).json({ message: "internal server error" });
            });
        })
        .catch((err) => {
          errorHandler(err);
          res.status(500).json({ message: "internal server error" });
        });
    })
    .catch((err) => {
      errorHandler(err);
      res.status(500).json({ message: "internal server error" });
    });
};

exports.remove = async function (req, res) {
  const { userid } = req.params;
  const nameArr = JSON.parse(req.query.name);

  db.User.findById(userid)
    .then(function (user) {
      const projects = user.projects.length ? user.projects.slice() : [];
      user.projects = projects.filter(
        (itm) => nameArr.indexOf(itm.name) === -1
      );

      user.save().then(function () {
        //remove project field from entries
        db.TimeEntry.find({ userId: user.id })
          .then(async function (foundEntries) {
            const toUpdate = foundEntries.filter(
              (itm) => nameArr.indexOf(itm.project) !== -1
            );

            const promiseArr = toUpdate.map(
              (itm) =>
                new Promise(function (resolve, reject) {
                  db.TimeEntry.update(
                    { _id: itm._id },
                    { $set: { project: "" } }
                  )
                    .then((updated) => resolve(updated))
                    .catch((err) => {
                      errorHandler(err);
                      res
                        .status(500)
                        .json({ message: "internal server error" });
                    });
                })
            );

            await Promise.all(promiseArr)
              .then(function () {
                db.User.findById(userid)
                  .populate("entries")
                  .exec((err, user) => {
                    if (err)
                      res
                        .status(400)
                        .json({ message: "internal server error" });
                    res.status(200).json(user);
                  })
                  .catch((err) => {
                    errorHandler(err);
                    res.status(500).json({ message: "internal server error" });
                  });
              })
              .catch((err) => {
                errorHandler(err);
                res.status(500).json({ message: "internal server error" });
              });
          })
          .catch((err) => {
            errorHandler(err);
            res.status(500).json({ message: "internal server error" });
          });
      });
    })
    .catch((err) => {
      errorHandler(err);
      res.status(500).json({ message: "internal server error" });
    });
};
