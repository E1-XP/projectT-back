const router = require('express').Router({ mergeParams: true });
const entries = require('../controllers/entries');

router.get('/', entries.all);

router.post('/new', entries.new);

router.post('/:entryid/update', entries.update);

router.post('/:entryid/delete', entries.delete);

module.exports = router;
