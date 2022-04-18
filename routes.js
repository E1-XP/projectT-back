import { Router } from "express";
export const router = Router({ mergeParams: true });

import { loginRequired } from "./middleware.js";

import authRoutes from "./features/auth/auth.route.js";
import entriesRoutes from "./features/entries/entry.route.js";
import projectsRoutes from "./features/projects/project.route.js";
import userRoutes from "./features/user/user.route.js";

router.get("/", (req, res) => {
  res.json({ message: "welcome to projectT backend." });
});

router.use("/auth", authRoutes);

router.use("/users/:userid", loginRequired, userRoutes);

router.use("/users/:userid/entries", loginRequired, entriesRoutes);

router.use("/users/:userid/projects", loginRequired, projectsRoutes);
