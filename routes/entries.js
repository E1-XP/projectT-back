const router = require("express").Router({ mergeParams: true });
const entries = require("../controllers/entries");

router.get("/", entries.all);

router.post("/", entries.new);

router.put("/:entryid/", entries.update);

router.delete("/:entryid/", entries.delete);

module.exports = router;
