const router = require('express').Router({ mergeParams: true });
const projects = require('../controllers/projects');

router.post('/new', projects.new);

router.post('/delete', projects.remove);

module.exports = router;
