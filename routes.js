const router = require("express").Router({ mergeParams: true });
const middleware = require("./middleware");

const authRoutes = require("./features/auth/auth.route");
const entriesRoutes = require("./entries");
const projectsRoutes = require("./features/projects/project.route");
const userRoutes = require("./features/user/user.route");

router.get("/", (req, res) => {
  res.json({ message: "welcome to projectT backend." });
});

router.use("/auth", authRoutes);

router.use("/users/:userid", middleware.loginRequired, userRoutes);

router.use("/users/:userid/entries", middleware.loginRequired, entriesRoutes);

router.use("/users/:userid/projects", middleware.loginRequired, projectsRoutes);

module.exports = router;
