import { newProjectHandler, removeProjectHandler } from "./project.service.js";

import { catchError } from "../../features/error/error.controller.js";

export const newProject = function (req, res) {
  const { userid } = req.params;
  const { name, color, client } = req.query;

  const data = newProjectHandler(userid, name, color, client).catch(
    catchError(res)
  );

  res.status(200).json(data);
};

export const removeProject = async function (req, res) {
  const { userid } = req.params;
  const projectNamesArr = JSON.parse(req.query.name);

  const user = removeProjectHandler(userid, projectNamesArr).catch(
    catchError(res)
  );

  res.status(200).json(user);
};
