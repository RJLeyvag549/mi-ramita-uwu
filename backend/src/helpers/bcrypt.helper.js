"use strict";

import bcrypt from "bcrypt";

//* FUNCIÓN PARA ENCRIPTAR PASSWORD
export async function encryptPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error en bcrypt.helper.js -> encryptPassword(): ", error);
    throw new Error("Error al encriptar la contraseña");
  }
}

//* FUNCIÓN PARA COMPARAR PASSWORDS
export async function comparePassword(password, receivedPassword) {
  try {
    return await bcrypt.compare(password, receivedPassword);
  } catch (error) {
    console.error("Error en bcrypt.helper.js -> comparePassword(): ", error);
    throw new Error("Error al comparar las contraseñas");
  }
}
