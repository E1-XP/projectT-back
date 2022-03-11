const db = require("../models");

const {
  getAllHandler,
  newEntryHandler,
  updateEntryHandler,
  deleteEntryHandler,
} = require("../services/entries");
const { catchError } = require("./helpers");

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
  const { entryid } = req.params;

  const respondWithFoundEntries = (foundEntries) =>
    res.status(200).json(foundEntries);

  updateEntryHandler(
    entryid,
    req.query,
    respondWithFoundEntries,
    catchError(res)
  );
};

exports.delete = function (req, res) {
  const { userid, entryid } = req.params;

  const respondWithEntryId = () => res.status(200).json(entryid);
  const respondWithEntriesId = () => res.status(200).json(JSON.parse(entryid));

  deleteEntryHandler(
    entryid,
    respondWithEntryId,
    respondWithEntriesId,
    catchError(res)
  );
};
