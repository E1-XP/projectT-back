const db = require('../models'),
    bcrypt = require('bcryptjs');

const { getUserData } = require('./../controllers/user');

const validateUser = require('./../services/validateUser');

exports.signup = function (req, res) {
    const { email, username, password } = req.body;
    const userData = { email, username, password };

    if (!validateUser(req.body)) return res.status(401).json({
        'message': 'invalid data provided'
    });

    db.User.create(userData).then(user => {
        req.session.user = user._id;

        const data = Object.keys(user._doc).reduce((acc, key, i, arr) => {
            (key !== 'password') ? acc[key] = user._doc[key] : null;
            return acc;
        }, {});

        res.status(200).json(data);

    }).catch(err => {
        console.log(err);
        if (err.code === 11000) res.status(409).json({
            "message": "user with same email or/and username already exist"
        });
        else res.status(400).json({ "message": "internal server error" });
    });
}

exports.login = function (req, res) {
    const { email, password, persistentSession } = req.body;

    if (!validateUser(req.body)) return res.status(401).json({
        'message': 'invalid data provided'
    });

    db.User.findOne({ email }).then(user => {

        if (!user) res.status(401).json({
            "message": "user/password combination not found"
        });
        else {
            if (bcrypt.compareSync(password, user.password)) {
                if (persistentSession) req.persistentSession.user = user._id
                else req.session.user = user._id;

                res.status(200).json({
                    "message": "success",
                    "userId": user._id
                });
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
        const id = req.session.user || req.persistentSession.user;

        db.User.findById(id).then(function (user) {
            if (!user) res.status(401).json({
                "message": "user/password combination not found"
            });

            getUserData(req, res);
        });
    }
    else res.status(401).json({ "message": "user/password combination not found" });
}
