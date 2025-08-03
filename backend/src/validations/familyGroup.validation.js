"use strict";

import Joi from "joi";

//* VALIDACIÓN PARA SOLO UNA PERSONA DEL FAMILY GROUP
export const onePersonFamilyGroupValidation = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .messages({
      "string.pattern.base": "Solo se permiten letras, espacios y tildes.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no debe exceder los 50 caracteres.",
      "string.empty": "El nombre es obligatorio.",
    }),

  lastName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .messages({
      "string.pattern.base": "Solo se permiten letras, espacios y tildes.",
      "string.min": "El apellido debe tener al menos 3 caracteres.",
      "string.max": "El apellido no debe exceder los 50 caracteres.",
      "string.empty": "El apellido es obligatorio.",
    }),

  rut: Joi.string()
    .required()
    .pattern(/^\d{2}\.\d{3}\.\d{3}-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.pattern.base": "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
    }),
});


//* VALIDACIÓN DEL ARRAY COMPLETO DEL FAMILY GROUP
export const familyGroupArrayValidation = Joi.object({
members: Joi.array().items(onePersonFamilyGroupValidation).min(1).required().messages({
"array.base": "Debes ingresar una lista de miembros.",
"array.min": "Debes ingresar al menos un miembro.",
"any.required": "El campo members es obligatorio.",
}),
});
