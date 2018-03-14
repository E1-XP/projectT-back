const router = require('express').Router();

const db = require('../models');
const auth = require('../helpers/auth');
const entries = require('../helpers/entries');
const middleware = require('../middleware');

router.get('/', (req, res) => {
    res.json({ "message": "welcome to projectT backend." });
});

router.post('/auth/signup', auth.signup);

router.post('/auth/login', auth.login);

router.post('/auth/logout', auth.logout);

router.post('/auth/refresh', auth.refresh);

router.get('/users/:userid/entries', entries.all);

router.post('/users/:userid/entries/new', entries.new);

router.post('/users/:userid/entries/:entryid/update', entries.update);

router.post('/users/:userid/entries/:entryid/delete', entries.delete);

module.exports = router;