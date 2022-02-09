const router = require("express").Router({ mergeParams: true });
const middleware = require("../middleware");

const authRoutes = require("./auth");
const entriesRoutes = require("./entries");
const projectsRoutes = require("./projects");
const userRoutes = require("./user");

router.get("/", (req, res) => {
  res.json({ message: "welcome to projectT backend." });
});

router.use("/auth", authRoutes);

router.use("/users/:userid", middleware.loginRequired, userRoutes);

router.use("/users/:userid/entries", middleware.loginRequired, entriesRoutes);

router.use("/users/:userid/projects", middleware.loginRequired, projectsRoutes);

module.exports = router;
