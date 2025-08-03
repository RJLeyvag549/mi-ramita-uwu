"use strict"

import Joi from "joi";

export const checkAttendanceValidation = {
  params: Joi.object({
    meetingId: Joi.number().integer().min(1).required().messages({
      "any.required": "El ID de la reunión es obligatorio.",
      "number.base": "El ID de la reunión debe ser un número.",
      "number.integer": "El ID de la reunión debe ser un número entero.",
      "number.min": "El ID de la reunión debe ser mayor o igual a 1.",
    }),
    userId: Joi.number().integer().min(1).required().messages({
      "any.required": "El ID del usuario es obligatorio.",
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.min": "El ID del usuario debe ser mayor o igual a 1.",
    }),
  }).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales en los parámetros.",
  }),

  body: Joi.object({
    firma: Joi.boolean().required().messages({
      "any.required": "'firma' es obligatorio.",
      "boolean.base": "'firma' debe ser true o false.",
    }),
  }).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales en el cuerpo.",
  }),
};

export const getAttendanceByMeetingIdValidation = Joi.object({
  id: Joi.number().integer().min(1).required()
    .messages({
      "any.required": "El ID de la reunión es obligatorio.",
      "number.base": "El ID debe ser un número.",
      "number.integer": "El ID de la reunión debe ser un número entero.",
      "number.min": "El ID de la reunión debe ser mayor o igual a 1.",
    }),
});