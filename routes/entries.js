const router = require("express").Router({ mergeParams: true });
const entries = require("../controllers/entries");

router.get("/", entries.all);

router.post("/", entries.new);

router.put("/", entries.update);

router.delete("/", entries.delete);

module.exports = router;
