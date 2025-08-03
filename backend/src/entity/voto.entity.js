// REPRESENTA UN VOTO EMITIDO POR UN VECINO
"use strict";

import { EntitySchema } from "typeorm";

export const VotoEntity = new EntitySchema({
    name: "Voto",
    tableName: "votos",
    columns: {
        id: { // primary key
            type: Number,
            primary: true,
            generated: true, // autogenerado
        },
        opcion_elegida: { // opción que selecciono el vecino
            type: String,
            nullable: false,
        },
        fecha_emision: { // cuándo se emitió el voto
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP", // se crea automáticamente
        },
    },
    relations: {
        votacion: { 
            type: "many-to-one", // cada voto pertenece a una única votación
            target: "Votacion",
            joinColumn: { name: "id_votacion"}, 
            /* Se hace un JOIN con la tabla Votacion y se agrega el atributo id_votacion a la tabla Voto */
            nullable: false,
            onDelete: "CASCADE" // si se borra la votación también se borran los votos
        },
        votante: { // el vecino que emitió el voto
            type: "many-to-one", // un vecino puede ser votante de diversas votaciones
            target: "User",
            joinColumn: { name: "id_vecino"}, // JOIN con tabla User, se crea columna id_vecino
            nullable: false
        }
    },
    uniques: [ // permite definir restricciones únicas a una tabla
        {
            name: "UNIQUE_VOTO_POR_VECINO", // el vecino no puede votar más de una vez en la misma votación
            columns: ["votacion", "votante"] // la combinacion de ambas columnas debe ser única
        }
    ]
});
export default VotoEntity;