"use strict";

import { EntitySchema } from "typeorm";

export const MeetingEntity = new EntitySchema({
  name: "Meeting",
  tableName: "meetings",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    lugar: {
      type: String,
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    modalidad: {
      type: String,
      default: "presencial",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: () => "CURRENT_TIMESTAMP",
    }
  },
  relations: {
    asistencias: {
      target: "Attendance",
      type: "one-to-many",
      inverseSide: "reunion"
    },
    acta: {
     target: "Act",         // Nombre que usaste en ActaEntity
     type: "one-to-one",
     inverseSide: "reunion", // Debe coincidir con el nombre del campo en ActaEntity
    },
  },
});

export default MeetingEntity;