const db = require('../models'),
    mongoose = require('mongoose'),
    getDayOfYear = require('date-fns/get_day_of_year');

exports.all = function (req, res) {
    const { userid } = req.params;
    const { begin, end } = req.query;

    db.TimeEntry.find({ userId: userid }).sort({ start: 'desc' })
        .then(foundEntries => res.status(200).json(entriesFilter(foundEntries)));

    function entriesFilter(entriesArr) {
        if (!begin) return entriesArr;

        const filtered = [];
        let startDate = begin;
        let i = 0;

        entriesArr.some(itm => {
            const thisDay = getDayOfYear(itm.start);

            if (thisDay !== startDate && thisDay < startDate) {
                i += 1;
                startDate = thisDay;
            }
            thisDay < begin && filtered.push(itm);

            return (i < (end || 10)) ? false : true;
        });

        return filtered;
    }
}

exports.new = function (req, res) {
    const { userid } = req.params;
    const entry = Object.assign({}, req.body, { userId: userid }, req.query);

    db.TimeEntry.create(entry).then(function (createdEntry) {
        db.User.findById(req.params.userid).then(function (user) {
            user.entries.push(createdEntry.id);

            user.save().then(savedUser => res.status(200).json(createdEntry))
                .catch(err => console.log(err));
        })

    }).catch(err => console.log(err));
}

exports.update = async function (req, res) {
    const { entryid, userid } = req.params;

    if (entryid.length === 24) {

        db.TimeEntry.update({ _id: entryid }, { $set: req.query })
            .then(function () {
                db.TimeEntry.findById(entryid)
                    .then((foundEntry) => res.status(200).json(foundEntry))
            }).catch(err => console.log(err));
    }
    else {
        const prArr = JSON.parse(entryid)
            .map(item => new Promise((res, rej) =>
                db.TimeEntry.update({ _id: item }, { $set: req.query })
                    .then(item => res())));

        const idArr = JSON.parse(entryid).map(itm => new mongoose.Types.ObjectId(itm));

        await Promise.all(prArr).then(function () {
            db.TimeEntry.find({ _id: { $in: idArr } })
                .then(foundEntries => res.status(200).json(foundEntries));
        }).catch(err => console.log(err));
    }
}

exports.delete = async function (req, res) {
    const { userid, entryid } = req.params;

    if (entryid.length === 24) {

        db.TimeEntry.findByIdAndRemove(entryid).then(data => {
            res.status(200).json(entryid);
        }).catch(err => console.log(err));

    } else {
        const prArr = JSON.parse(entryid)
            .map(item => new Promise((res, rej) =>
                db.TimeEntry.findByIdAndRemove(item)
                    .then(item => res())));

        await Promise.all(prArr).then(() => {
            res.status(200).json(JSON.parse(entryid));
        }).catch(err => console.log(err));
    }
}