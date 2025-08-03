"use strict";
import Joi from "joi";

export const fundingValidation = Joi.object({
  name: Joi.string()
  .min(3)
  .max(100)
  .required()
  .messages({
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 100 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  amount: Joi.number()
  .positive()
  .required()
  .messages({
    "number.base": "El monto debe ser un número.",
    "number.positive": "El monto debe ser positivo.",
    "any.required": "El monto es obligatorio.",
  }),
  date: Joi.string()
  .required()
  .messages({
    "string.empty": "La fecha es obligatoria.",
    "any.required": "Debe ingresar una fecha para la acreditación.",
  }),
  status: Joi.string()
  .valid("pendiente", "acreditado", "rechazado")
  .default("pendiente")
  .messages({
    "any.only": "El estado debe ser 'pendiente', 'acreditado' o 'rechazado'.",
    "string.empty": "El estado es obligatorio.",
    "any.required": "Debe seleccionar un estado para la acreditación.",
  }),
  comprobante: Joi.string()
  .optional()
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });