import { Router } from "express";
import { createFunding, getFunding, updateFunding, deleteFunding } from "../controllers/funding.controller.js";
import { exportFundingSheet } from "../controllers/fundingSheet.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { uploadComprobanteSingle, handleFileSizeLimit } from "../middleware/uploadVoucher.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

router.post("/create", uploadComprobanteSingle, handleFileSizeLimit, createFunding);
router.get("/get", getFunding);
router.put("/update/:id", updateFunding);
router.delete("/delete/:id", deleteFunding);
router.get("/planilla", exportFundingSheet);


export default router;