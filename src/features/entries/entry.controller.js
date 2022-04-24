import {
  getAllHandler,
  newEntryHandler,
  updateEntryHandler,
  deleteEntryHandler,
} from "./entry.service.js";
import { catchError } from "../error/error.controller.js";

export const all = function (req, res) {
  const { userid } = req.params;
  const { begin, end, days } = req.query;

  const entries = getAllHandler(begin, end, days, userid).catch(
    catchError(res)
  );

  res.status(200).json(entries);
};

export const newEntry = function (req, res) {
  const { userid: userId } = req.params;
  const entry = Object.assign({}, req.body, { userId }, req.query);

  const createdEntry = newEntryHandler(entry, userId).catch(catchError(res));

  res.status(200).json(createdEntry);
};

export const updateEntry = function (req, res) {
  const entryData = req.body;

  const foundEntries = updateEntryHandler(entryData).catch(catchError(res));

  res.status(200).json(foundEntries);
};

export const deleteEntry = function (req, res) {
  const { userid } = req.params;
  const entryIds = req.body;

  deleteEntryHandler(entryIds).catch(catchError(res));

  res.status(200).json(entryIds);
};
