const db = require('../models');

exports.checkForSession = function (req, res, next) {
    if (req.session && req.session.user) {
        const { email } = req.session.user;

        db.User.findOne({ email }).then(user => {
            if (user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                res.locals.user = user;
            }
            next();
        })
    }
    else next();
}

exports.loginRequired = function (req, res, next) {
    if (!req.user) {
        res.status(401).json({ "message": "authentication required" });
    }
    else next();
}
