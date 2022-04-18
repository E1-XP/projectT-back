import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";
import mongoose from "mongoose";

import * as db from "../../models.js";

export const filterEntries = function (entriesArr, begin, end, dayCount = 10) {
  if (!begin && !end) return defaultFilter(entriesArr, dayCount);

  return noEndDateProvidedFilter(entriesArr, dayCount, begin); //10 next available days
};

function noEndDateProvidedFilter(entriesArr, maxPeriodLength, begin) {
  if (!begin) return entriesArr;

  const filtered = [];
  const startDay = begin;
  let previousItemStart = entriesArr[0].start;
  let dayCount = 0;
  let i = 0;

  while (i < entriesArr.length) {
    const item = entriesArr[i];
    i += 1;

    if (item.start > startDay) continue;

    if (differenceInCalendarDays(item.start, previousItemStart)) {
      dayCount += 1;

      if (dayCount > maxPeriodLength) break;
    }

    filtered.push(item);

    previousItemStart = item.start;
  }
  return filtered;
}

function defaultFilter(entriesArr, maxPeriodLength) {
  if (!entriesArr.length) return entriesArr;

  const filtered = [];
  let previousItemStart = entriesArr[0].start;
  let dayCount = 0;
  let i = 0;

  while (i < entriesArr.length) {
    const item = entriesArr[i];

    if (differenceInCalendarDays(item.start, previousItemStart) && item.stop) {
      dayCount += 1;

      if (dayCount > maxPeriodLength - 1) break;
    }

    filtered.push(item);

    i += 1;
    previousItemStart = item.start;
  }
  return filtered;
}

export const getAllHandler = function (
  begin,
  end,
  days,
  userid,
  respondWithEntries,
  respondWithFilteredEntries,
  catchError
) {
  const num = (value) => (value ? Number(value) : value);

  if (begin && end) {
    db.TimeEntry.find({
      userId: userid,
      start: {
        $lte: num(begin),
        $gte: num(end),
      },
    })
      .sort({ start: "desc" })
      .then((foundEntries) => respondWithEntries(foundEntries))
      .catch((err) => catchError(err));
  } else {
    db.TimeEntry.find({ userId: userid })
      .sort({ start: "desc" })
      .then((foundEntries) =>
        respondWithFilteredEntries(
          filterEntries(foundEntries, num(begin), num(end), num(days))
        )
      )
      .catch((err) => catchError(err));
  }
};

export const newEntryHandler = function (
  entry,
  userId,
  respondWithCreatedEntry,
  catchError
) {
  db.TimeEntry.create(entry)
    .then(function (createdEntry) {
      db.User.findById(userId).then(function (user) {
        user.entries.push(createdEntry.id);

        user
          .save()
          .then(() => respondWithCreatedEntry(createdEntry))
          .catch((err) => catchError(err));
      });
    })
    .catch((err) => catchError(err));
};

export const updateEntryHandler = function (
  entryData,
  respondWithFoundEntries,
  catchError
) {
  const updateData = entryData.map(
    ({ _id, ...data }) =>
      new Promise((resolve, reject) =>
        db.TimeEntry.update({ _id }, { $set: data })
          .then(() => resolve())
          .catch((err) => catchError(err))
      )
  );

  const idArr = entryData.map(({ _id }) => new mongoose.Types.ObjectId(_id));

  Promise.all(updateData)
    .then(function () {
      db.TimeEntry.find({ _id: { $in: idArr } }).then(respondWithFoundEntries);
    })
    .catch((err) => catchError(err));
};

export const deleteEntryHandler = function (
  entryId,
  respondWithEntriesId,
  catchError
) {
  const prArr = entryId.map(
    (id) =>
      new Promise((resolve, reject) =>
        db.TimeEntry.findByIdAndRemove(id)
          .then((id) => resolve())
          .catch((err) => catchError(err))
      )
  );

  Promise.all(prArr)
    .then(() => respondWithEntriesId())
    .catch((err) => catchError(err));
};
