const router = require("express").Router({ mergeParams: true });
const userRoutes = require("./user.controller");

router.get("/", userRoutes.getUserData);

router.put("/", userRoutes.editUserData);

router.put("/avatar", userRoutes.uploadAvatar);

router.delete("/avatar", userRoutes.deleteAvatar);

router.put("/password", userRoutes.editPassword);

module.exports = router;
