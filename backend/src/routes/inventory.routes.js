"use strict"
import { Router } from "express";
import { getInventories, getInventoryById, createInventory, updateInventoryById, deleteInventoryById } from "../controllers/inventory.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.use(isAdmin);

router.get("/", getInventories);
router.get("/:id", getInventoryById);
router.post("/", createInventory);
router.put("/:id", updateInventoryById);
router.delete("/:id", deleteInventoryById);

export default router;