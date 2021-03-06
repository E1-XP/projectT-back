const db = require('../models');

exports.loginRequired = function (req, res, next) {
    if (req.session && req.session.user || req.persistentSession && req.persistentSession.user) {
        next();
    }
    else res.status(401).json({ "message": "authentication required" });
}
