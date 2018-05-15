const db = require('../models');

exports.checkForSession = function (req, res, next) {
    if (req.session && req.session.user || req.persistentSession && req.persistentSession.user) {

        const { _id } = req.session.user || req.persistentSession.user;

        db.User.findOne({ _id }).then(user => {
            if (user) {
                req.user = user;
                delete req.user.password;
                if (req.session) req.session.user = user;
                if (req.persistentSession) req.persistentSession.user = user;
                res.locals.user = user;
            }
            next();
        })
    }
    else next();
}

exports.loginRequired = function (req, res, next) {
    if (req.session && req.session.user || req.persistentSession && req.persistentSession.user) {
        next();
    }
    else res.status(401).json({ "message": "authentication required" });
}
