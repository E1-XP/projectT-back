const differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
const format = require("date-fns/format");

module.exports = function filterEntries(entriesArr, begin, end, dayCount = 10) {
    if (!begin && !end) return defaultFilter(entriesArr, dayCount);

    return noEndDateProvidedFilter(entriesArr, dayCount, begin); //10 next available days
}

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
         
            if (dayCount > maxPeriodLength -1) break;
        }

        filtered.push(item);

        i += 1;
        previousItemStart = item.start;
    }
    return filtered;
}



