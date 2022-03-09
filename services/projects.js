const db = require("../models");

exports.newProjectHandler = function (
  userId,
  name,
  color,
  client,
  respondWithData,
  catchError
) {
  db.User.findById(userId)
    .then(function (user) {
      const projects = user.projects.length ? user.projects.slice() : [];

      projects.push({ name, color, client });
      user.projects = projects;

      user
        .save()
        .then(function () {
          db.User.findById(userId)
            .then((user) => {
              const data = Object.keys(user._doc).reduce((acc, key) => {
                key !== "password" && key !== "entries"
                  ? (acc[key] = user._doc[key])
                  : null;
                return acc;
              }, {});

              respondWithData(data);
            })
            .catch((err) => catchError(err));
        })
        .catch((err) => catchError(err));
    })
    .catch((err) => catchError(err));
};

exports.removeProjectHandler = function (
  userId,
  projectNamesArr,
  respondWithUser,
  catchError
) {
  db.User.findById(userId)
    .then(function (user) {
      const projects = user.projects.length ? user.projects.slice() : [];
      user.projects = projects.filter(
        (itm) => projectNamesArr.indexOf(itm.name) === -1
      );

      user.save().then(function () {
        //remove project field from entries
        db.TimeEntry.find({ userId: user.id })
          .then(async function (foundEntries) {
            const toUpdate = foundEntries.filter(
              (itm) => projectNamesArr.indexOf(itm.project) !== -1
            );

            const promiseArr = toUpdate.map(
              (itm) =>
                new Promise(function (resolve, reject) {
                  db.TimeEntry.update(
                    { _id: itm._id },
                    { $set: { project: "" } }
                  )
                    .then((updated) => resolve(updated))
                    .catch((err) => catchError(err));
                })
            );

            await Promise.all(promiseArr)
              .then(function () {
                db.User.findById(userId)
                  .populate("entries")
                  .exec((err, user) => {
                    if (err) return catchError(err);

                    respondWithUser(user);
                  });
              })
              .catch((err) => catchError(err));
          })
          .catch((err) => catchError(err));
      });
    })
    .catch((err) => catchError(err));
};
