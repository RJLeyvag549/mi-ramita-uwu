"use strict";

import { EntitySchema } from "typeorm";

export const FundingEntity = new EntitySchema({
    name: "Funding",
    tableName: "fundings",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
            nullable: false,
        },
        amount: {
            type: "decimal",
            nullable: false,
        },
        date: {
            type: String,
            nullable: false,
        },
        status: {
            type: String,
            default: "pendiente",
        },
        comprobante: {
            type: String,
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
});

export default FundingEntity;