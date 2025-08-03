"use strict";

import Joi from "joi";

export const IdParamValidation = Joi.object({
    id: Joi.number()
        .required()
        .messages({
            "number.base": "El ID debe ser un número.",
            "any.required": "El ID es obligatorio."
        })
}).options({ allowUnknown: true }).messages({
    "object.unknown": "Parámetro desconocido en la solicitud."
});