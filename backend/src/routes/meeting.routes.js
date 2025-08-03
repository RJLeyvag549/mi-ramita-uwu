"use strict";
import { Router } from "express";
import { createMeeting, getMeetings, getMeeting, getMeetingById, updateMeetingById, deleteMeetingById } from "../controllers/meeting.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.get("/filtrar", getMeeting);
router.use(isAdmin);
router.post("/", createMeeting);
router.get("/", getMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeetingById);
router.delete("/:id", deleteMeetingById);

export default router;