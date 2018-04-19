const router = require('express').Router();
const auth = require('../controllers/auth');

router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.post('/logout', auth.logout);

router.post('/refresh', auth.refresh);

module.exports = router;
