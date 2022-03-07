const db = require("../models");
const {
  newProjectHandler,
  removeProjectHandler,
} = require("../services/projects");

const { catchError } = require("./helpers");

exports.new = function (req, res) {
  const { userid } = req.params;
  const { name, color, client } = req.query;

  const respondWithData = (data) => res.status(200).json(data);

  newProjectHandler(
    userid,
    name,
    color,
    client,
    respondWithData,
    catchError(res)
  );
};

exports.remove = async function (req, res) {
  const { userid } = req.params;
  const projectNamesArr = JSON.parse(req.query.name);

  const respondWithUser = (user) => res.status(200).json(user);

  removeProjectHandler(
    userid,
    projectNamesArr,
    respondWithUser,
    catchError(res)
  );
};
