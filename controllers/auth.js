const db = require('../models'),
    bcrypt = require('bcrypt'),
    getDayOfYear = require('date-fns/get_day_of_year');

exports.signup = function (req, res) {
    const { email, username, password } = req.body;
    const userData = { email, username, password }

    db.User.create(userData).then(user => {
        req.session.user = user._id;

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
    const { email, password, persistentSession } = req.body;

    db.User.findOne({ email }).then(user => {
        if (!user) res.status(401).json({ "message": "user/password combination not found" });
        else {
            if (bcrypt.compareSync(password, user.password)) {
                persistentSession ?
                    req.persistentSession.user = user._id : req.session.user = user._id;

                populateEntries(user)
                    .then(data => Object.assign({}, data, { entries: entriesFilter(data.entries) }))
                    .then(filteredData => res.status(200).json(filteredData))
                    .catch(err => console.log(err));
            }
            else res.status(401).json({ "message": "user/password combination not found" });
        }
    }).catch(err => res.status(400).json({ "message": "internal server error" }));
}

exports.logout = function (req, res) {
    if (req.session) req.session.reset();
    if (req.persistentSession) req.persistentSession.reset();
    res.status(200).json({ "message": "success" });
}

exports.refresh = function (req, res) {
    if (req.session.user || req.persistentSession.user) {
        const sessionData = req.session.user ?
            req.session.user : req.persistentSession.user;

        db.User.findById(sessionData).then(function (user) {
            if (!user) return res.status(401).json({ "message": "user/password combination not found" });

            populateEntries(user)
                .then(data => Object.assign({}, data, { entries: entriesFilter(data.entries) }))
                .then(filteredData => res.status(200).json(filteredData))
                .catch(err => console.log(err));
        });
    }
    else res.status(401).json({ "message": "user/password combination not found" });
}

function populateEntries(user) {
    return new Promise(function (res, rej) {
        db.TimeEntry.find({ userId: user._id }).sort({ start: 'desc' }).then(foundEntries => {
            user.entries = foundEntries;

            const data = Object.keys(user._doc).reduce((acc, key) => {
                if (key !== 'password') acc[key] = user._doc[key];
                return acc;
            }, {});

            res(data);
        });
    });
}

function entriesFilter(entriesArr) {
    if (!entriesArr.length) return entriesArr;

    const filtered = [];
    let startDate = getDayOfYear(entriesArr[0].start);
    let i = 0;

    entriesArr.some(itm => {
        const thisDay = getDayOfYear(itm.start);

        if (thisDay !== startDate) {
            i += 1;
            startDate = thisDay;
        }
        filtered.push(itm);

        return (i < 10) ? false : true;
    });

    return filtered;
}