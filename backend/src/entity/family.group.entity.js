"use strict";

import { EntitySchema } from "typeorm";
import UserEntity from "../entity/user.entity.js";

export const FamilyGroupEntity = new EntitySchema({
    name: "FamilyGroup",
    tableName: "family_groups",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        firstName: {
            type: String,
            nullable: false,
        },
        lastName: {
            type: String,
            nullable: false,
        },
        rut: {
            type: String,
            unique: true,
            nullable: false,
        },
    },
    
    relations: {
        mainUser: {
            type: "many-to-one",
            target: UserEntity,
            joinColumn: true,
            onDelete: "CASCADE", 
            nullable: false,
        }
    },
});

export default FamilyGroupEntity;