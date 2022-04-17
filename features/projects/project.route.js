const router = require("express").Router({ mergeParams: true });
const projects = require("./projects.controller");

router.post("/", projects.new);

router.delete("/", projects.remove);

module.exports = router;
