const getDayOfYear = require('date-fns/get_day_of_year');

module.exports = function filterEntries(entriesArr, begin, end, dayCount = 10) {
    if (!begin && !end) return defaultFilter(entriesArr, dayCount);

    return noEndDateProvidedFilter(entriesArr, dayCount, begin); //10 next available days
}

function noEndDateProvidedFilter(entriesArr, maxPeriodLength, begin) {
    if (!begin) return entriesArr;

    const filtered = [];
    const startDay = getDayOfYear(Number(begin));
    let previousItemDay;
    let dayCount = 0;
    let i = 0;

    while (i < entriesArr.length) {
        const item = entriesArr[i];
        const currItemDayOfYear = getDayOfYear(item.start);
        i += 1;

        if (currItemDayOfYear > startDay) continue;

        if (currItemDayOfYear !== previousItemDay) {
            dayCount += 1;
            if (dayCount > maxPeriodLength + 1) break;
        }

        filtered.push(item);

        previousItemDay = currItemDayOfYear;
    }
    return filtered;
}

function defaultFilter(entriesArr, maxPeriodLength) {
    if (!entriesArr.length) return entriesArr;

    const filtered = [];
    let previousItemDay;
    let dayCount = 0;
    let i = 0;

    while (i < entriesArr.length) {
        const item = entriesArr[i];
        i += 1;

        if (!item.stop) continue;

        const currItemDayOfYear = getDayOfYear(item.start);

        if (currItemDayOfYear !== previousItemDay) {
            dayCount += 1;
            if (dayCount > maxPeriodLength + 1) break;
        }

        filtered.push(item);

        previousItemDay = currItemDayOfYear;
    }
    return filtered;
}
