"use strict";

import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import TransactionRoutes from "./transaction.routes.js";
import InventoryRoutes from "./inventory.routes.js";
import familyGroupRoutes from "./familyGroup.routes.js";
import pdfRoutes from "./pdf.routes.js";
import votacionRoutes from "./voto.routes.js";
import votoRoutes from "./voto.routes.js";
import meetingRoutes from "./meeting.routes.js"
import attendanceRoutes from "./attendance.routes.js"
import ActRoutes from "./meeting_act.routes.js"
import publicacionesRoutes from "./publicaciones.routes.js"
import comentariosRoutes from "./comentarios.routes.js";
import fundingRoutes from "./funding.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/transaction", TransactionRoutes);
router.use("/inventory", InventoryRoutes);

router.use("/family", familyGroupRoutes);
router.use("/certificate", pdfRoutes);

router.use("/votacion", votacionRoutes);
router.use("/voto", votoRoutes);
    
router.use("/meetings", meetingRoutes);
router.use("/meetings", attendanceRoutes);
router.use("/meetings", ActRoutes);
router.use("/publicaciones", publicacionesRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/funding", fundingRoutes);

export default router;