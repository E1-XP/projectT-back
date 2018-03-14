const db = require('../models');

exports.all = function (req, res) {
    const { userid } = req.params;
    console.log(userid);
}

exports.new = function (req, res) {
    const { userid } = req.params;
    const entry = Object.assign(req.body, { userId: userid });

    db.TimeEntry.create(entry).then(function (createdEntry) {
        db.User.findById(req.params.userid).then(function (user) {
            user.entries.push(createdEntry.id);

            user.save().then(savedUser => {
                return res.status(200).json(createdEntry);
            }).catch(err => console.log(err));
        })

    }).catch(err => console.log(err));
}

exports.update = function (req, res) {
    const { entryid } = req.params;
    const { stop } = req.query;

    db.TimeEntry.findByIdAndUpdate(entryid, { stop }, { new: true })
        .then(data => res.status(200).json(data))
        .catch(err => console.log(err));
}

exports.delete = function (req, res) {

}