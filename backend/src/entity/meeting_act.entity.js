"use strict";

import { EntitySchema } from "typeorm";

export const ActaEntity = new EntitySchema({
  name: "Act",
  tableName: "acts",
  columns: {
    id: {
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
    firma: {
      type: Boolean,
      default: false,
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
    reunion: {
      target: "Meeting",
      type: "one-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default ActaEntity;