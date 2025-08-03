"use strict";
import Joi from "joi";

export const createComentarioValidation = Joi.object({
  contenido: Joi.string()
    .min(3)
    .max(300)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\n\s-]+$/)
    .messages({
      "string.pattern.base": "El comentario solo puede contener texto y signos de puntuación válidos",
      "string.min": "El comentario debe tener al menos 3 caracteres",
      "string.max": "El comentario no debe superar los 300 caracteres",
      "string.empty": "El comentario es obligatorio",
    }),
});
export const updateComentarioValidation = Joi.object({
  contenido: Joi.string()
    .min(3)
    .max(300)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\n\s-]+$/)
    .messages({
      "string.pattern.base": "El comentario solo puede contener texto y signos de puntuación válidos",
      "string.min": "El comentario debe tener al menos 3 caracteres",
      "string.max": "El comentario no debe superar los 300 caracteres",
      "string.empty": "El comentario es obligatorio",
    }),
});

// Validación para IDs numéricos (como en params)
export const idParamValidation = Joi.object({
  id_publicacion: Joi.number().integer().positive().required()
    .messages({
      "number.base": "El ID de publicación debe ser un número",
      "number.integer": "El ID de publicación debe ser un número entero",
      "number.positive": "El ID de publicación debe ser positivo",
      "any.required": "El ID de publicación es obligatorio"
    }),
});

export const idComentarioValidation = Joi.object({
  id_comentario: Joi.number().integer().positive().required()
    .messages({
      "number.base": "El ID del comentario debe ser un número",
      "number.integer": "El ID del comentario debe ser un número entero",
      "number.positive": "El ID del comentario debe ser positivo",
      "any.required": "El ID del comentario es obligatorio"
    }),
});