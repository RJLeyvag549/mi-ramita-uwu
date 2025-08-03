"use strict";
import { Router } from "express";
import { getAttendanceByMeetingId, checkAttendance } from "../controllers/attendance.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.use(isAdmin);

router.get("/:id/attendance", getAttendanceByMeetingId);
router.put("/:meetingId/attendance/:userId", checkAttendance);

export default router;