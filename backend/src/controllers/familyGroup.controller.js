"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import FamilyGroup from "../entity/family.group.entity.js";
import { familyGroupArrayValidation } from "../validations/familyGroup.validation.js";
import { groupErrorsByField } from "../helpers/errorFormatter.helper.js";
import { validateRutsUniqueness } from "../helpers/exists.helper.js";

//* FUNCIÓN PARA AÑADIR MIEMBROS AL GRUPO FAMILIAR
export async function addFamilyMember(req, res) {
  try {
    const { userId } = req.params;
    const { members } = req.body;
    
const { error } = familyGroupArrayValidation.validate(
  { members },
  { abortEarly: false }
);
if (error) {
  const erroresAgrupados = groupErrorsByField(error.details);
  return res.status(400).json({
    message: "Errores de validación",
    details: erroresAgrupados,
  });
}

    const userRepository = AppDataSource.getRepository(User);
    const familyRepository = AppDataSource.getRepository(FamilyGroup);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado!" });
  
//* VERIFICAR RUT (exists.helper.js)
const erroresRut = await validateRutsUniqueness(members, userRepository, familyRepository);

if (Object.keys(erroresRut).length > 0) {
  return res.status(400).json({
    message: "Errores de validación",
    details: erroresRut,
  });
}

    for (const member of members) {
      const { firstName, lastName, rut } = member;

      const newMember = familyRepository.create({
        firstName,
        lastName,
        rut,
        mainUser: user, 
      });

      await familyRepository.save(newMember);
    }

    return res.status(201).json({ message: "Grupo familiar creado exitosamente!" });

  } catch (error) {
    console.error("Error en familyGroup.controller.js -> addFamilyMember(): ", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}