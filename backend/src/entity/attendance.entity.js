"use strict";

import { EntitySchema } from "typeorm";

export const AttendanceEntity = new EntitySchema({
  name: "Attendance",
  tableName: "attendances",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    firma: {
      type: Boolean,
      default: false,
    },
  },
  relations: {
    reunion: {
      target: "Meeting",
      type: "many-to-one",
      joinColumn: true,
      inverseSide: "asistencias",
    },
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      inverseSide: "asistencias",
      nullable: false,
    },
  },
});

export default AttendanceEntity;
