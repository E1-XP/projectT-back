const router = require('express').Router(),
    bcrypt = require('bcrypt');

const db = require('../models');
const auth = require('../helpers/auth');
const middleware = require('../middleware');

router.get('/', (req, res) => {
    res.json({ "message": "welcome to projectT backend." });
});

router.post('/auth/signup', auth.signup);

router.post('/auth/login', auth.login);

router.post('/auth/logout', auth.logout);

router.post('/auth/refresh', auth.refresh);

module.exports = router;