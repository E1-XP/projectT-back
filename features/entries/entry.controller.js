const db = require("../../models");

const {
  getAllHandler,
  newEntryHandler,
  updateEntryHandler,
  deleteEntryHandler,
} = require("./entry.service");
const { catchError } = require("../error/error.controller");

exports.all = function (req, res) {
  const { userid } = req.params;
  const { begin, end, days } = req.query;

  const respondWithEntries = (entries) => res.status(200).json(entries);

  const respondWithFilteredEntries = (entries) => res.status(200).json(entries);

  getAllHandler(
    begin,
    end,
    days,
    userid,
    respondWithEntries,
    respondWithFilteredEntries,
    catchError(res)
  );
};

exports.new = function (req, res) {
  const { userid } = req.params;
  const entry = Object.assign({}, req.body, { userId: userid }, req.query);

  const respondWithCreatedEntry = (createdEntry) =>
    res.status(200).json(createdEntry);

  newEntryHandler(entry, userid, respondWithCreatedEntry, catchError(res));
};

exports.update = function (req, res) {
  const entryData = req.body;

  const respondWithFoundEntries = (foundEntries) =>
    res.status(200).json(foundEntries);

  updateEntryHandler(entryData, respondWithFoundEntries, catchError(res));
};

exports.delete = function (req, res) {
  const { userid } = req.params;
  const entryIds = req.body;

  const respondWithEntriesId = () => res.status(200).json(entryIds);

  deleteEntryHandler(entryIds, respondWithEntriesId, catchError(res));
};
