import { Router } from "express";
const router = Router({ mergeParams: true });

import * as auth from "./auth.controller.js";

router.post("/signup", auth.signup);

router.post("/login", auth.login);

router.post("/logout", auth.logout);

router.post("/refresh", auth.refresh);

export default router;
