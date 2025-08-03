"use strict";
import Joi from "joi";

// Crear publicación
export const createValidation = Joi.object({
  titulo: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .messages({
      "string.pattern.base": "El título solo puede contener letras y espacios",
      "string.min": "El título debe tener más de 3 caracteres",
      "string.max": "El título debe tener menos de 50 caracteres",
      "string.empty": "El título es obligatorio",
    }),

  contenido: Joi.string()
    .min(3)
    .max(300)
    .required()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\-\n\s]+$/)
    .messages({
      "string.pattern.base": "El contenido solo puede contener letras, números y puntuación válida",
      "string.min": "El contenido debe tener más de 3 caracteres",
      "string.max": "El contenido debe tener menos de 300 caracteres",
      "string.empty": "El contenido es obligatorio",
    }),

  tipo_de_publicacion: Joi.string()
    .valid("Bienestar físico", "Medioambiente", "Educativos", "Arte y creatividad", "Entretenimiento")
    .required()
    .messages({
      "any.only": "La opción debe ser una de las siguientes: Bienestar físico, Medioambiente, Educativos, Arte y creatividad, Entretenimiento",
      "string.empty": "El tipo de publicación es obligatorio",
    }),
});

// Actualizar publicación
export const updateValidation = Joi.object({
  titulo: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .messages({
      "string.pattern.base": "El título solo puede contener letras y espacios",
      "string.min": "El título debe tener más de 3 caracteres",
      "string.max": "El título debe tener menos de 50 caracteres",
    })
    .optional(),// <-- importante ya que si puede no estar no afecta

  contenido: Joi.string()
    .min(3)
    .max(300)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\-\n\s]+$/)
    .messages({
      "string.pattern.base": "El contenido solo puede contener letras, números y puntuación válida",
      "string.min": "El contenido debe tener más de 3 caracteres",
      "string.max": "El contenido debe tener menos de 300 caracteres",
    })
    .optional(),

  tipo_de_publicacion: Joi.string()
    .valid("Bienestar físico", "Medioambiente", "Educativos", "Arte y creatividad", "Entretenimiento")
    .messages({
      "any.only": "La opción debe ser una de las siguientes: Bienestar físico, Medioambiente, Educativos, Arte y creatividad, Entretenimiento",
    })
    .optional(),
});
