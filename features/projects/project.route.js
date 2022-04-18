import { Router } from "express";
const router = Router({ mergeParams: true });

import * as projects from "./projects.controller.js";

router.post("/", projects.newProject);

router.delete("/", projects.removeProject);

export default router;
