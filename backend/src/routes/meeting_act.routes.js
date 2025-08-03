"use strict";
import { Router } from "express";
import { createAct, getActByMeetingId, updateAct, signAct } from "../controllers/meeting_act.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.use(isAdmin);

router.post("/:meetingId/act", createAct);
router.get("/:meetingId/act", getActByMeetingId);
router.put("/:meetingId/act", updateAct);
router.patch("/:meetingId/act", signAct);

export default router;