"use strict";

import { Router } from "express";
import { getUsers, getUserById, getUsersByFilters, updateUserById, deleteUserById, updateRequestStatus } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

router.get("/filtered", getUsersByFilters);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.patch("/:id", updateRequestStatus);

export default router;