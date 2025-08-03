"use strict";

import Joi from "joi";

const meetingIdParam = Joi.object({
  meetingId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "El ID de la reunión es obligatorio.",
      "number.base": "El ID de la reunión debe ser un número.",
      "number.integer": "El ID de la reunión debe ser un número entero.",
      "number.min": "El ID de la reunión debe ser mayor o igual a 1.",
    }),
})
  .or("meetingId")
  .unknown(false).messages({
  "object.unknown": "No se permiten parámetros adicionales.",
  "object.missing": "Debes ingresar el ID"
});

const actaBody = Joi.object({
  titulo: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.base": "El título debe ser texto.",
      "string.empty": "El título no puede estar vacío.",
      "string.min": "El título debe tener al menos 5 caracteres.",
      "string.max": "El título no puede exceder los 100 caracteres.",
      "any.required": "El título es obligatorio.",
    }),
  contenido: Joi.string()
    .min(10)
    .max(5000)
    .required()
    .messages({
      "string.base": "El contenido debe ser texto.",
      "string.empty": "El contenido no puede estar vacío.",
      "string.min": "El contenido debe tener al menos 10 caracteres.",
      "string.max": "El contenido no puede exceder los 5000 caracteres.",
      "any.required": "El contenido es obligatorio.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales en el acta.",
});

export const meetingActValidation = {
  params: meetingIdParam,
  body: actaBody,
};