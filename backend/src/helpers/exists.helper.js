"use strict";

//* ESTE ARCHIVO ES PARA VERIFICAR SI RUT YA EXISTE EN BASE DE DATOS (PARA FAMILY GROUP)


//* VERIFICAR SI RUT EXISTE EN USER O FAMILYGROUP 
export async function rutExistsInSystem(rut, userRepository, familyRepository) {
  const inUser = await userRepository.findOneBy({ rut });
  const inFamily = await familyRepository.findOneBy({ rut });
  return !!(inUser || inFamily);
}
//* VERIFICA MÚLTIPLES RUT Y DEVUELVE ERRORES AGRUPADOS 
export async function validateRutsUniqueness(members, userRepository, familyRepository) {
  const erroresRut = {};

  for (const member of members) {
    const { rut } = member;
    const exists = await rutExistsInSystem(rut, userRepository, familyRepository);
    if (exists) {
      erroresRut[rut] = [`El RUT ${rut} ya está registrado en el sistema.`];
    }
  }

  return erroresRut;
}
