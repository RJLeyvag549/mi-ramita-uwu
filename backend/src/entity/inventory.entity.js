"use strict";
import { EntitySchema } from "typeorm";

export const InventoryEntity = new EntitySchema({
    name: "Inventory",
    target: "Inventory",
    tableName: "inventories",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        itemName: {
            type: "varchar",
            nullable: false,
        },
        quantity: {
            type: "int",
            nullable: false,
        },
        description: {
            type: "varchar",
            nullable: true,
        },
        unitPrice: {
            type: "float",
            nullable: false,
        },
        status: {
            type: "enum",
            enum: ["available", "out_of_stock"],
            nullable: false,
            default: "available",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
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
export default InventoryEntity;