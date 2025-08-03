"use strict";
import Joi from "joi";

const fechaFuturo = (value, helpers) => {
    const ahora = new Date();
    const fecha = new Date(value);
    if(isNaN(fecha.getTime())) {
        return helpers.message("La fecha debe tener un formato válido.");
    }
    if (fecha < ahora){
        return helpers.message("La fecha debe ser igual o posterior a la fecha actual.");
    }
    return value;
};

const opcionesUnicas = (value, helpers) => {
    const set = new Set(value);
    if(set.size !== value.length){
        return helpers.message("Las opciones no deben repetirses.");
    }
    return value;
};

export const votacionValidation = Joi.object({
    titulo: Joi.string().min(3).max(100).required().messages({
        "string.empty": "El título no puede estar vacío.",
        "string.min": "El título debe tener al menos 3 caracteres.",
        "string.max": "El título no puede exeder los 100 caracteres.",
    }),
    descripcion: Joi.string().allow(null, "").max(300).messages({
        "string.max": "La descripción no puede superar los 300 caracteres.",
    }),
    fecha_inicio: Joi.date().required().custom(fechaFuturo).messages({
        "any.required": "La fecha de inicio es obligatoria.",
    }),
    fecha_fin: Joi.date().required().messages({
        "any.required": "La fecha de fin es obligatoria.",
    }),
    opciones: Joi.array()
    .items(Joi.string().min(1).messages({
        "string.min": "Cada opción debe tener al menos un carácter.",
        "string.empty": "Las opciones no pueden estar vacías.",
    }))
    .min(2)
    .required()
    .custom(opcionesUnicas)
    .messages({
        "array.min": "Debe haber al menos 2 opciones.",
        "array.required": "Las opciones son obligatorias.",
        "array.base": "Las opciones deben estar en un arreglo.",
    }),
})
.unknown(false)
.messages({
    "object.unknown": "No se permiten campos adicionales",
});

export const votacionUpdateValidation = Joi.object({
    titulo: Joi.string().min(3).max(100).messages({
        "string.min": "El título debe tener al menos 3 caracteres.",
        "string.max": "El título no puede exeder los 100 caracteres.",
    }),
    descripcion: Joi.string().allow(null, "").max(300).messages({
        "string.max": "La descripción no puede superar los 300 caracteres.",
    }),
    fecha_inicio: Joi.date().custom(fechaFuturo).messages({
        "date.base": "La fecha de inicio debe ser una fecha válida.",
    }),
    fecha_fin: Joi.date().custom(fechaFuturo).messages({
        "date.base": "La fecha de fin debe ser una fecha válida.",
    }),
    opciones: Joi.array()
    .items(Joi.string().min(1).messages({
        "string.min": "Cada opción debe tener al menos un carácter.",
    }))
    .min(2)
    .custom(opcionesUnicas)
    })
    .or("titulo", "descripcion", "fecha_inicio", "fecha_fin", "opciones")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten campos adicionales",
        "object.missing": "Debes enviar al menos un campo para actualizar.",
});