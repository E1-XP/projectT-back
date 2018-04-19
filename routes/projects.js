const router = require('express').Router();
const projects = require('../controllers/projects');

router.post('/new', projects.new);

router.post('/delete', projects.remove);

module.exports = router;
