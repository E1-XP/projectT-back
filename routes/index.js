const router = require('express').Router({ mergeParams: true });
// const db = require('../models');
//const middleware = require('../middleware');
const authRoutes = require('./auth');
const entriesRoutes = require('./entries');
const projectsRoutes = require('./projects');
const userRoutes = require('./user');

router.get('/', (req, res) => {
    res.json({ "message": "welcome to projectT backend." });
});

router.use('/auth', authRoutes);

router.use('/users/:userid', userRoutes);

router.use('/users/:userid/entries', entriesRoutes);

router.use('/users/:userid/projects', projectsRoutes);

module.exports = router;