const db = require('../models');

exports.all = function (req, res) {
    const { userid } = req.params;

    db.TimeEntry.find({ userId: userid })
        .then(foundEntries => res.status(200).json(foundEntries));
}

exports.new = function (req, res) {
    const { userid } = req.params;
    //const {description}=req.query;
    const entry = Object.assign(req.body, { userId: userid }, req.query);

    db.TimeEntry.create(entry).then(function (createdEntry) {
        db.User.findById(req.params.userid).then(function (user) {
            user.entries.push(createdEntry.id);

            user.save().then(savedUser => {
                return res.status(200).json(createdEntry);
            }).catch(err => console.log(err));
        })

    }).catch(err => console.log(err));
}

exports.update = async function (req, res) {
    const { entryid, userid } = req.params;

    if (entryid.length === 24) {

        db.TimeEntry.update({ _id: entryid }, { $set: req.query })
            .then(function () {
                db.TimeEntry.find({ userId: userid })
                    .then((foundEntries) => res.status(200).json(foundEntries))
            }).catch(err => console.log(err));
    }
    else {
        const prArr = JSON.parse(entryid)
            .map(item => new Promise((res, rej) =>
                db.TimeEntry.update({ _id: item }, { $set: req.query })
                    .then(() => res())));


        await Promise.all(prArr).then(function () {
            db.TimeEntry.find({ userId: userid })
                .then(foundEntries => res.status(200).json(foundEntries));
        }).catch(err => console.log(err));
    }
}

exports.delete = async function (req, res) {
    const { userid, entryid } = req.params;

    if (entryid.length === 24) {

        db.TimeEntry.findByIdAndRemove(entryid).then(data => {
            db.TimeEntry.find({ userId: userid })
                .then(foundEntries => res.status(200).json(foundEntries));
        }).catch(err => console.log(err));

    } else {
        const prArr = JSON.parse(entryid)
            .map(item => new Promise((res, rej) =>
                db.TimeEntry.findByIdAndRemove(item).then(() => res())));

        await Promise.all(prArr).then(() => {
            db.TimeEntry.find({ userId: userid })
                .then(foundEntries => res.status(200).json(foundEntries));
        }).catch(err => console.log(err));
    }
}