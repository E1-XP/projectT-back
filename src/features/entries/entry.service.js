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

export const getAllHandler = async function (begin, end, days, userId) {
  const numOrUndef = (value) => (value ? Number(value) : value);

  if (begin && end) {
    const foundEntries = await db.TimeEntry.find({
      userId,
      start: {
        $lte: numOrUndef(begin),
        $gte: numOrUndef(end),
      },
    }).sort({ start: "desc" });

    return foundEntries;
  } else {
    const foundEntries = await db.TimeEntry.find({ userId }).sort({
      start: "desc",
    });

    return filterEntries(
      foundEntries,
      numOrUndef(begin),
      numOrUndef(end),
      numOrUndef(days)
    );
  }
};

export const newEntryHandler = async function (entry, userId) {
  const createdEntry = await db.TimeEntry.create(entry);

  const user = await db.User.findById(userId);
  user.entries.push(createdEntry.id);

  await user.save();

  return createdEntry;
};

export const updateEntryHandler = async function (entryData) {
  await Promise.all(
    entryData.map(
      async ({ _id, ...data }) =>
        await db.TimeEntry.update({ _id }, { $set: data })
    )
  );

  const idArr = entryData.map(({ _id }) => new mongoose.Types.ObjectId(_id));

  const foundEntries = await db.TimeEntry.find({ _id: { $in: idArr } });
  return foundEntries;
};

export const deleteEntryHandler = async function (entryId) {
  await Promise.all(
    entryId.map(async (id) => await db.TimeEntry.findByIdAndRemove(id))
  );

  return entryId;
};
