"use strict";
import { Router } from "express";
import { createVotacion, getAllVotaciones, getVotacionesDisp, updateVotacionById, deleteVotacionById } from "../controllers/votacion.controller.js";

import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Proteger todas las rutas con JWT
router.use(authenticateJwt);

// Ruta para vecinos: ver votaciones disponibles (no requiere ser admin)
router.get("/disponibles", getVotacionesDisp);

// Las rutas siguientes solo son accesibles para administradores
router.use(isAdmin);

// Ruta: crear votación (solo admins)
router.post("/", createVotacion);

// Ruta: ver todas las votaciones
router.get("/", getAllVotaciones);

// Ruta: actualizar una votación por ID
router.put("/:id", updateVotacionById);

// Ruta: eliminar una votación por ID
router.delete("/:id", deleteVotacionById);

