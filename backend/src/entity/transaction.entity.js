"use strict";

import { EntitySchema } from "typeorm";

export const TransactionEntity = new EntitySchema({
    name: "Transaction",
    target: "Transaction",
    tableName: "transactions",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,            
        },
        amount: {
            type: "float",
            nullable: false,
        },
        description: {
            type: "varchar",
            nullable: false,
        },
        status: {
            type: "enum",
            enum: ["pending", "completed", "rejected"],
            nullable: false,
            default: "pending",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt : {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        }
    }
});


export default TransactionEntity;

