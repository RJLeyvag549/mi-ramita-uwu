"use strict";
import Joi from "joi";

export const votoValidation = Joi.object({
    id_votacion: Joi.number().integer().positive().required().messages({
        "number.base": "El ID de la votación debe ser un número.",
        "number.integer": "El ID de la votación debe ser un número entero.",
        "number.positive": "El ID de la votación debe ser un número positivo.",
        "any.required": "El ID de la votación es obligatorio.",
    }),
    opcion_elegida: Joi.string().trim().min(1).required().messages({
        "string.empty": "Debes seleccionar una opción.",
        "string.min": "La opción elegida debe tener al menos un carácter.",
        "any.required": "La opción elegida es obligatoria.",
    }),
})
.unknown(false)
.messages({
    "object.unknown": "No se permiten campos adicionales",
});
