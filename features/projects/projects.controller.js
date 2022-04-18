import * as db from "./../../models.js";
import { newProjectHandler, removeProjectHandler } from "./project.service.js";

import { catchError } from "../../features/error/error.controller.js";

export const newProject = function (req, res) {
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

export const removeProject = async function (req, res) {
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
