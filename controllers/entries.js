const db = require('../models'),
    mongoose = require('mongoose');

const filterEntries = require('./../services/filterEntries');

exports.all = function (req, res) {
    const { userid } = req.params;
    const { begin, end, days } = req.query;

    const num = (value) => value ? Number(value) : value;

    if (begin && end) {
        db.TimeEntry
            .find({
                userId: userid,
                start: {
                    $lte: num(begin),
                    $gte: num(end)
                }
            })
            .sort({ start: 'desc' })
            .then(foundEntries => res.status(200).json(foundEntries));
    }
    else {
        db.TimeEntry
            .find({ userId: userid })
            .sort({ start: 'desc' })
            .then(foundEntries =>
                res.status(200)
                    .json(filterEntries(foundEntries,
                        num(begin), num(end), num(days))));
    }
}

exports.new = function (req, res) {
    const { userid } = req.params;
    const entry = Object.assign({}, req.body, { userId: userid }, req.query);

    db.TimeEntry.create(entry)
        .then(function (createdEntry) {
            db.User.findById(req.params.userid)
                .then(function (user) {
                    user.entries.push(createdEntry.id);

                    user.save().then(savedUser => res.status(200).json(createdEntry))
                        .catch(err => console.log(err));
                });

        }).catch(err => console.log(err));
}

exports.update = function (req, res) {
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

        Promise.all(prArr).then(function () {
            db.TimeEntry.find({ _id: { $in: idArr } })
                .then(foundEntries => res.status(200).json(foundEntries));
        }).catch(err => console.log(err));
    }
}

exports.delete = function (req, res) {
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

        Promise.all(prArr).then(() => {
            res.status(200).json(JSON.parse(entryid));
        }).catch(err => console.log(err));
    }
}
