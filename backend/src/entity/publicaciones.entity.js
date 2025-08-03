"use strict";

import { EntitySchema } from "typeorm";

export const publicacionesEntity = new EntitySchema({
    name: "Publicaciones",
    tableName: "publicaciones",
    columns: {
        id_publicacion: {
            type: Number,
            primary: true,
            generated: true,
        },
        titulo: {
            type: String,
            nullable: false,
        },
        contenido: {
            type: String,
            nullable: false,
        },
        fecha_publicacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        tipo_de_publicacion: {
            type: String,
            enum: ["Bienestar físico", "Medioambiente", "Educativos", "Arte y creatividad", "Entretenimiento"],
        },
        actualizacion_de_publicacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },

    // Aqui debe ir
    relations: {
        comentarios: {
            type: "one-to-many",
            target: "Comentarios",
            inverseSide: "publicacion",
            cascade: true,
        },
    },
});

export default publicacionesEntity;
