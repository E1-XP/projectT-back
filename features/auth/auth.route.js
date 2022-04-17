const router = require("express").Router({ mergeParams: true });
const auth = require("./auth.controller");

router.post("/signup", auth.signup);

router.post("/login", auth.login);

router.post("/logout", auth.logout);

router.post("/refresh", auth.refresh);

module.exports = router;
