import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js"
import { UserEntity } from "../entity/user.entity.js"
import { publicacionesEntity } from "../entity/publicaciones.entity.js"
import { ComentariosEntity } from "../entity/comentarios.entity.js"
import FamilyGroup from "../entity/family.group.entity.js"
import Attendance from "../entity/attendance.entity.js"
import Funding from "../entity/funding.entity.js"
import Inventory from "../entity/inventory.entity.js"
import Meeting from "../entity/meeting.entity.js"
import Act from "../entity/meeting_act.entity.js"
import Transaction from "../entity/transaction.entity.js"
import Votacion from "../entity/votacion.entity.js"
import Voto from "../entity/voto.entity.js"

"use strict";

export const AppDataSource = new DataSource({

    type: "postgres",
    host: HOST,
    port: 5432,
    username: DB_USERNAME,
    password: PASSWORD,
    database: DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        UserEntity,
        publicacionesEntity,
        ComentariosEntity,
        FamilyGroup,
        Attendance,
        Funding,
        Inventory,
        Meeting,
        Act,
        Transaction,
        Votacion,
        Voto
    ]
});


    export async function connectDB() {
    try {
    await AppDataSource.initialize();
    console.log("=> Conexión con la base de datos exitosa!");
    } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
}
}
