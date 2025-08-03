//* SERVICIO PARA GUARDAR DOCUMENTOS DEL USUARIO (CÉDULA Y RESIDENCIA)

"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

export async function saveDocumentService(data) {  
    try {
        const userRepository = AppDataSource.getRepository(User);

        const { userId, docIdentityPath, docResidencePath } = data;

        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return [null, "Usuario no encontrado"];
    }

        user.docIdentity = docIdentityPath;
        user.docResidence = docResidencePath;

        const updatedUser = await userRepository.save(user);

        return [updatedUser, null];

    } catch (error) {
        console.error("Error al guardar documentos del usuario:", error);
        return [null, "Error interno del servidor"];
    }
}


