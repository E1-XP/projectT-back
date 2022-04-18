import { Router } from "express";
const router = Router({ mergeParams: true });

import * as userRoutes from "./user.controller.js";

router.get("/", userRoutes.getUserData);

router.put("/", userRoutes.editUserData);

router.put("/avatar", userRoutes.uploadAvatar);

router.delete("/avatar", userRoutes.deleteAvatar);

router.put("/password", userRoutes.editPassword);

export default router;
