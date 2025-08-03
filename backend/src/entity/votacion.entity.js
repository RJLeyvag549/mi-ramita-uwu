// REPRESENTA UNA VOTACIÓN CREADA POR LA DIRECTIVA
"use strict"; // modo estricto: ayuda a detectar errores facilmente

import { EntitySchema } from "typeorm"; // importa la funcion entityschema desde typeorm

// Definición de votaciones
export const VotacionEntity = new EntitySchema({ 
    name: "Votacion", // nombre del esquema dentro del código
    tableName: "votaciones", // nombre real de la tabla en PostgreSQL
    // Se definen columnas en la tabla votaciones
    columns: { 
        id: { // primary key
            type: Number,
            primary: true,
            generated: true, // autogenerado
        },
        titulo: { // nombre de la votación
            type: String,
            nullable: false,
        },
        descripcion: { // descripción de la votación
            type: String,
            nullable: true,
        },
        fecha_inicio: { // cuándo empieza la votación
            type: "timestamp",
            nullable: false,
        },
        fecha_fin: { // cuándo termina la votación
            type: "timestamp",
            nullable: false,
        },
        opciones: { // opciones a votar
            type: "simple-array", // almacena como texto separado por comas
            nullable: false,
        },
        editada_en: { // fecha en la que se editó la votación
        type: "timestamp",
        nullable: true, // puede ser nulo si no ha sido editada aún
        },
        creada_en: { // fecha en la que se creo la votación
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP", // se establece al momento de guardar
        },
        creada_por: {
        type: String,
        nullable: false,
        },
    },

});
export default VotacionEntity;