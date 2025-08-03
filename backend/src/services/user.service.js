//* ESTE ARCHIVO CREA EL USUARIO QUE ESTÁ TRATANDO DE REGISTRARSE

"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUserService(data) {
try {
  const userRepository = AppDataSource.getRepository(User);

  const { firstName, lastName, rut, email, password, contact, homeAddress, docIdentity, docResidence } = data;

  const newUser = userRepository.create({
    role: "user",
    firstName,
    lastName,
    rut,
    email,
    password: await encryptPassword(password),
    contact,
    homeAddress,
    docIdentity,
    docResidence,
    requestStatus: "pendiente", //* PORQUE ESTÁ PENDIENTE DE APROBACIÓN
    });

    const savedUser = await userRepository.save(newUser);
    return [savedUser, null];
  } catch (error) {
    console.error("Error en user.service.js -> createUserService:", error);
    return [null, "Error al crear el usuario"];
  }
}
