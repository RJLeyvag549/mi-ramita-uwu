//* CRUD DE USUARIOS

"use strict";

import User from "../entity/user.entity.js";
import FamilyGroup from "../entity/family.group.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { sendEmail } from "../services/email.service.js";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* ESTA FUNCIÓN LA PLANEO USAR PARA LISTAR A TODOS LOS USUARIOS REGISTRADOS (APROBADOS)
//* Busca y devuelve todos los usuarios registrados en la base de datos (no incluye grupo familiar).
export async function getUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const approvedUsers = await userRepository.find({
      where: { requestStatus: "aprobado" },
    });

    const filteredUsers = approvedUsers.map(user => ({
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      rut: user.rut,
    }));

    res.status(200).json({ message: "Usuarios encontrados: ", data: filteredUsers });
  } catch (error) {
    console.error("Error en user.controller.js -> getUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Busca y devuelve un usuario específico según su id (incluyendo grupo familiar en caso de que tenga).
export async function getUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id }, relations: ["familyGroup"] });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

      const filteredUser = {
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      rut: user.rut,
      email: user.email,
      contact: user.contact,
      homeAddress: user.homeAddress,
      docIdentity: user.docIdentity,
      docResidence: user.docResidence,
      familyGroup: user.familyGroup.map((member) => ({
        firstName: member.firstName,
        lastName: member.lastName,
        rut: member.rut,
      })),
    };

    res.status(200).json({ message: "Usuario encontrado: ", data: filteredUser });
  } catch (error) {
    console.error("Error en user.controller.js -> getUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Busca y devuelve todos los usuarios registrados en la base de datos SEGÚN SU ROL Y/O SEGÚN ESTADO DE SOLICITUD
export async function getUsersByFilters(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { role, requestStatus } = req.query;

    const validRoles = ["administrator", "user"];
    const validStatuses = ["aprobado", "rechazado", "pendiente"];

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    if (requestStatus && !validStatuses.includes(requestStatus)) {
      return res.status(400).json({ message: "Estado de solicitud no válido" });
    }

    const filters = {};
    if (role) filters.role = role;
    if (requestStatus) filters.requestStatus = requestStatus;

    const users = await userRepository.find({
      where: filters,
      relations: ["familyGroup"],
      order: { createdAt: "DESC" }
    });

    res.status(200).json({ message: "Usuarios filtrados!", data: users });
  } catch (error) {
    console.error("Error en user.controller.js -> getUsersByFilters():", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Actualiza un usuario específico según su id.
export async function updateUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { firstName, lastName, email, contact, homeAddress, requestStatus, familyGroup } = req.body;
    const user = await userRepository.findOne({ where: { id }, relations: ["familyGroup"] });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.contact = contact || user.contact;
    user.homeAddress = homeAddress || user.homeAddress;
    user.requestStatus = requestStatus || user.requestStatus;

    await userRepository.save(user);

    if (Array.isArray(familyGroup)) {
      const familyGroupRepository = AppDataSource.getRepository(FamilyGroup);

      for (const member of familyGroup) {
        const { id: memberId, firstName, lastName } = member;

        const familyMember = await familyGroupRepository.findOneBy({ id: memberId });

        if (familyMember) {
          familyMember.firstName = firstName || familyMember.firstName;
          familyMember.lastName = lastName || familyMember.lastName;

          await familyGroupRepository.save(familyMember);
        }
      }
    }

    const updateUser = await userRepository.findOne({ where: { id }, relations: ["familyGroup"] });

    res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente!", data: updateUser });
  } catch (error) {
    console.error("Error en user.controller.js -> updateUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Elimina un usuario específico según su id.
export async function deleteUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error en user.controller.js -> deleteUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Cambia el estado de solicitud del usuario (aprobado, rechazado, pendiente...)
export async function updateRequestStatus(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { requestStatus } = req.body;

    const allowedStatus = ["aprobado", "rechazado"];
    if (!allowedStatus.includes(requestStatus)) {
      return res.status(400).json({ message: "Estado inválido! Debe ser: aprobado, rechazado" });
    }

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.requestStatus !== "pendiente") {
      return res.status(400).json({ message: `La solicitud ya fue procesada (${user.requestStatus}).` });
    }

    user.requestStatus = requestStatus;
    await userRepository.save(user);

    //* CORREO AUTOMATIZADO
    const subject =
      requestStatus === "aprobado"
        ? "¡Tu solicitud fue aprobada!"
        : "Tu solicitud fue rechazada";

    const message =
      requestStatus === "aprobado"
        ? `Hola ${user.firstName}, tu solicitud ha sido aprobada. Ya puedes ingresar al sistema.`
        : `Hola ${user.firstName}, lamentamos informarte que tu solicitud fue rechazada.`;

    await sendEmail(user.email, subject, message, `<p>${message}</p>`);

    res.status(200).json({ message: `Solicitud actualizada a: ${requestStatus}`, data: user });
  } catch (error) {
    console.error("Error en user.controller.js -> updateRequestStatus(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}









