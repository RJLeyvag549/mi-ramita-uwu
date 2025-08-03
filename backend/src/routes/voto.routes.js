"use strict";
import { Router } from "express";
import { contarVotosPorOpcion, emitirVoto } from "../controllers/voto.controller.js";

import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Middleware para autenticar el JWT
router.use(authenticateJwt); 

// Rutas públicas
router.post("/", emitirVoto);
router.get("/:id", contarVotosPorOpcion);

export default router;