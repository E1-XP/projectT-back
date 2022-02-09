const router = require("express").Router({ mergeParams: true });
const projects = require("../controllers/projects");

router.post("/", projects.new);

router.delete("/", projects.remove);

module.exports = router;
