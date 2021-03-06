const router = require('express').Router({ mergeParams: true });
const userRoutes = require('../controllers/user');

router.get('/', userRoutes.getUserData);

router.put('/', userRoutes.editUserData);

router.put('/avatar', userRoutes.upload);

router.put('/password', userRoutes.editPassword);

module.exports = router;
