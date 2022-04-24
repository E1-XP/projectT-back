import * as db from "../../models.js";

export const newProjectHandler = async function (userId, name, color, client) {
  const user = await db.User.findById(userId);

  const projects = user.projects.length ? user.projects.slice() : [];

  projects.push({ name, color, client });
  user.projects = projects;

  await user.save();

  const userData = await db.User.findById(userId);

  const filtered = Object.keys(userData._doc).reduce((acc, key) => {
    key !== "password" && key !== "entries"
      ? (acc[key] = userData._doc[key])
      : null;
    return acc;
  }, {});

  return filtered;
};

export const removeProjectHandler = async function (userId, projectNamesArr) {
  const user = await db.User.findById(userId);

  const projects = user.projects.length ? user.projects.slice() : [];

  user.projects = projects.filter(
    (itm) => projectNamesArr.indexOf(itm.name) === -1
  );

  await user.save();

  //remove project field from entries
  const foundEntries = await db.TimeEntry.find({ userId: user.id });

  const toUpdate = foundEntries.filter(
    (itm) => projectNamesArr.indexOf(itm.project) !== -1
  );

  await Promise.all(
    toUpdate.map(
      async (itm) =>
        await db.TimeEntry.update({ _id: itm._id }, { $set: { project: "" } })
    )
  );

  await db.User.findById(userId)
    .populate("entries")
    .exec((err, user) => {
      if (error) {
        throw error;
      }

      return user;
    });
};
