// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: 'public/uploads/',
//     filename: function (req, file, cb) {
//         cb(null, req.params.userid + '.jpg')
//     }
// });

// const upload = multer({ storage });

const router = require('express').Router({ mergeParams: true });
const userRoutes = require('../controllers/user');

router.post('/avatar', userRoutes.upload);

router.post('/passwordedit', userRoutes.editpassword);

router.post('/useredit', userRoutes.edituserdata);

module.exports = router;
