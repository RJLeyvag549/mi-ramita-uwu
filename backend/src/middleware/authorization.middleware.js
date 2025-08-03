"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOneBy({ email: req.user?.email, });

    if (!userFound) return res.status(404).json("Usuario no encontrado");

    const rolUser = userFound.role;

    // Si el rol no es administrador, devolver un error 403
    if (rolUser !== "administrator")
      return res
        .status(403)
        .json({
          message:
            "Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción.",
        });

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}