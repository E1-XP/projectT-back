import { Router } from "express";
const router = Router({ mergeParams: true });

import * as entries from "./entry.controller.js";

router.get("/", entries.all);

router.post("/", entries.newEntry);

router.put("/", entries.updateEntry);

router.delete("/", entries.deleteEntry);

export default router;
