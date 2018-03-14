const db = require('../models'),
    bcrypt = require('bcrypt');

exports.signup = function (req, res) {
    const { email, username, password } = req.body;
    const userData = { email, username, password }

    db.User.create(userData).then(user => {
        req.session.user = user.email;

        const data = Object.keys(user._doc).reduce((acc, key, i, arr) => {
            (key !== 'password') ? acc[key] = user._doc[key] : null;
            return acc;
        }, {});

        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        if (err.code === 11000) res.status(401).json({ "message": "user with same email or/and username already exist" });
        else res.status(400).json({ "message": "internal server error" });
    });
}

exports.login = function (req, res) {
    const { email, password } = req.body;

    db.User.findOne({ email }).then(user => {
        if (!user) res.status(401).json({ "message": "user/password combination not found" });
        else {
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user.email;

                populateEntries(user).then(data => res.status(200).json(data))
                    .catch(err => console.log(err));
            }
            else res.status(401).json({ "message": "user/password combination not found" });
        }
    }).catch(err => res.status(400).json({ "message": "internal server error" }));
}

exports.logout = function (req, res) {
    req.session.reset();
    res.status(200).json({ "message": "success" });
}

exports.refresh = function (req, res) {
    if (req.session.user) {

        db.User.findOne({ email: req.session.user }).then(user => {
            populateEntries(user).then(data => res.status(200).json(data))
                .catch(err => console.log(err));
        });
    }
    else res.status(401).json({ "message": "internal server error" });
}

function populateEntries(user) {
    return new Promise(function (res, rej) {
        db.TimeEntry.find({ userId: user.id }).then(foundEntries => {
            user.entries = foundEntries;

            const data = Object.keys(user._doc).reduce((acc, key) => {
                (key !== 'password') ? acc[key] = user._doc[key] : null;
                return acc;
            }, {});

            res(data);
        });
    });
}