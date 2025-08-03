"use strict";
import joi from "joi";

export const createInventoryValidation = joi.object({
    itemName: joi.string()
        .required()
        .min(3)
        .max(100)
        .messages({
            "string.base": "El nombre del artículo debe ser de tipo texto.",
            "any.required": "El nombre del artículo es obligatorio.",
            "string.min": "El nombre del artículo debe tener al menos 3 caracteres.",
            "string.max": "El nombre del artículo no puede exceder los 100 caracteres."
        }),
    quantity: joi.number()
        .required()
        .min(1)
        .messages({
            "number.base": "La cantidad debe ser un número.",
            "number.min": "La cantidad debe ser al menos 1.",
            "any.required": "La cantidad es obligatoria."
        }),
    description: joi.string()
        .required()
        .min(5)
        .max(255)
        .messages({
            "string.base": "La descripción debe ser de tipo texto.",
            "string.max": "La descripción no puede exceder los 255 caracteres.",
            "any.required": "La descripción es obligatoria.",
            "string.min": "La descripción debe tener al menos 5 caracteres."
        }),
    unitPrice: joi.number()
        .required()
        .min(0)
        .messages({
            "number.base": "El precio unitario debe ser un número.",
            "number.min": "El precio unitario no puede ser negativo.",
            "any.required": "El precio unitario es obligatorio."
        })
});

export const updateInventoryValidation = joi.object({
    itemName: joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.base": "El nombre del artículo debe ser de tipo texto.",
            "string.min": "El nombre del artículo debe tener al menos 3 caracteres.",
            "string.max": "El nombre del artículo no puede exceder los 100 caracteres."
        }),
    quantity: joi.number()
        .min(0)
        .messages({
            "number.base": "La cantidad debe ser un número.",
            "number.min": "la cantidad no puede ser negativa."
        }),
    description: joi.string()
        .min(5)
        .max(255)
        .messages({
            "string.base": "La descripción debe ser de tipo texto.",
            "string.min": "La descripción debe tener al menos 5 caracteres.",
            "string.max": "La descripción no puede exceder los 255 caracteres."
        }),
    unitPrice: joi.number()
        .min(0)
        .messages({
            "number.base": "El precio unitario debe ser un número.",
            "number.min": "El precio unitario no puede ser negativo."
        })
}).or("itemName", "quantity", "description", "unitPrice").messages({
    "object.missing": "Al menos uno de los campos (itemName, quantity, description, unitPrice) debe ser proporcionado para actualizar."
});
