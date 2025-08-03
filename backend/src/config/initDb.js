"use strict";

import User from "../entity/user.entity.js";
//import FamilyGroup from "../entity/family.group.entity.js";

import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

// Función para crear usuarios por defecto
export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    //const familyRepository = AppDataSource.getRepository(FamilyGroup);

    //* AGREGAAR 1 ADMIN Y 3 USUARIOS
    const count = await userRepository.count();
    if (count > 0) return;
    const users = [
      {
        role: "administrator",
        firstName: "Silvana Monserrat",
        lastName: "Araya Retamal",
        rut: "19.157.881-3",
        email: "toreto@gmail.com",
        password: await encryptPassword("toretoteamo"),
        contact: "20690318",
        homeAddress: "Avenida Tori #34, Concepción",
        docIdentity: "uploads/doc-admin-identity1.pdf", 
        docResidence: "uploads/doc-admin-residence1.pdf",
        requestStatus: "aprobado"
      },
      {
        role: "user",
        firstName: "Moises Pirito",
        lastName: "Araya Retamal",
        rut: "77.777.777-k",
        email: "moisepirito@gmail.com",
        password: await encryptPassword("blancateamo"),
        contact: "82205439",
        homeAddress: "Avenida Pirito #23, Concepción",
        docIdentity: "uploads/doc-admin-identity2.pdf", 
        docResidence: "uploads/doc-admin-residence2.pdf",
        requestStatus: "aprobado"
      }
    ];

        console.log("Creando usuarios...");

        for (const user of users) {
            await userRepository.save((
                userRepository.create(user)
            ));
            console.log(`Usuario '${user.username}' creado exitosamente.`);
        }
    } catch (error) {
        console.error("Error al crear usuarios: ", error);
        process.exit(1);
    }
}