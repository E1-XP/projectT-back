const db = require('../models');

exports.new = function (req, res) {
    const { userid } = req.params;
    const { name, color, client } = req.query;

    db.User.findById(userid).then(function (user) {
        const projects = user.projects.length ? user.projects.slice() : [];

        projects.push({ name, color, client });
        user.projects = projects;

        user.save().then(function () {

            db.User.findById(userid).then(function (user) {
                res.status(200).json(user);
            })
        }).catch(err => res.status(400).json({ "message": "internal server error" }));

    }).catch(err => res.status(400).json({ "message": "internal server error" }));
}

exports.remove = async function (req, res) {
    const { userid } = req.params;
    let name = JSON.parse(req.query.name);

    db.User.findById(userid).then(function (user) {
        let projects = user.projects.length ? user.projects.slice() : [];
        user.projects = projects.filter(itm => name.indexOf(itm.name) === -1);

        user.save().then(function () {
            db.TimeEntry.find({ userId: user.id }).then(async function (foundEntries) {
                const toUpdate = foundEntries.filter(itm => name.indexOf(itm) === -1);

                const promiseAr = toUpdate.map(itm => new Promise(function (res, rej) {
                    db.TimeEntry.update({ userId: itm._id }, { $set: { project: '' } })
                        .then(updated => res());
                }));

                await Promise.all(promiseAr).then(function () {
                    db.User.findById(userid).then(user =>
                        res.status(200).json(user));

                }).catch(err => res.status(400).json({ "message": "internal server error" }));
            });
        });

    }).catch(err => res.status(400).json({ "message": "internal server error" }));
}