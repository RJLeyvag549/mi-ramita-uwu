"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js"; //para verificar si el usuario esta autenticado con JWT.
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getPublicaciones } from "../controllers/publicaciones.controller.js";
import { createPublicaciones } from "../controllers/publicaciones.controller.js";
import { getPublicacionConComentarios } from "../controllers/publicaciones.controller.js";
import { updatePublicacion } from "../controllers/publicaciones.controller.js";
import { deletePublicacion } from "../controllers/publicaciones.controller.js";

const router = Router();
router.use(authenticateJwt);//

router.get("/", getPublicaciones); // cualquiera autenticado
router.get("/:id_publicacion", getPublicacionConComentarios); // cualquiera autenticado


router.post("/", isAdmin, createPublicaciones); // solo admin
router.put("/:id_publicacion", isAdmin, updatePublicacion); // solo admin
router.delete("/:id_publicacion", isAdmin, deletePublicacion); // solo admin

export default router;
