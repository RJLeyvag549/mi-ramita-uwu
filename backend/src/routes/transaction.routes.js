"use strict";
import { Router } from "express";
import { getTransactions, createTransaction, getTransactionById, updateTransactionById, deleteTransactionById} from "../controllers/transaction.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.use(isAdmin);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransactionById);
router.delete("/:id", deleteTransactionById);

export default router;


