"use strict";

import { AppDataSource } from "../config/configDb.js";
import Voto, { VotoEntity } from "../entity/voto.entity.js";
import VotacionEntity from "../entity/votacion.entity.js";
import { Equal } from "typeorm";
import UserEntity from "../entity/user.entity.js";
import { votoValidation } from "../validations/voto.validation.js";
import { validarOpcionElegida } from "../helpers/voto.helper.js";
//Emitir voto (usuario autenticado)
export async function emitirVoto(req, res) {
    try {
        const { error } = votoValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Repositorios de las entidades
        const votoRepo = AppDataSource.getRepository(VotoEntity);
        const votacionRepo = AppDataSource.getRepository(VotacionEntity);
        const userRepo = AppDataSource.getRepository(UserEntity);
        
        // Datos del body
        const { id_votacion, opcion_elegida } = req.body;

        // Busca al usuario autenticado por email (viene en el token JWT)
        const user = await userRepo.findOneBy({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const id_vecino = user.id; // Usamos el ID del usuario autenticado

        // Verifica si la votación existe
        const votacion = await votacionRepo.findOne({ where: { id: id_votacion } });
        if (!votacion) {
            return res.status(404).json({ message: "Votación no encontrada" });
        }

        // Verifica si la votación está activa
        const ahora = new Date();
        if (ahora < votacion.fecha_inicio || ahora > votacion.fecha_fin) { 
            return res.status(400).json({ message: "La votación no está activa" });
        }

        //Validar opción válida
        const resultadoValidacion = validarOpcionElegida(votacion, opcion_elegida);
        if (!resultadoValidacion.esValido) {
            return res.status(400).json({
                message: resultadoValidacion.mensaje,
                opciones_validas: resultadoValidacion.opciones_validas,
            });
        }


        // Verifica si el usuario ya votó en esta votación
        const yaVoto = await votoRepo.findOne({ // Busca en la tabla de votos
            where: { // Condición de búsqueda
                votacion: Equal(votacion.id), // Buscar voto que esté relacionado con la votación que tenga el ID id_votacion
                votante: Equal(user.id), // Buscar voto que esté relacionado con el usuario que tenga el ID id_vecino
            },
        });
        if (yaVoto) {
            return res.status(400).json({ message: "Ya has votado en esta votación" });
        }

        // Crea y guarda el voto
        const nuevoVoto = votoRepo.create({
            opcion_elegida,
            votacion: { id: id_votacion }, // Relaciona con la votación
            votante: { id: id_vecino }, // Relaciona con el usuario
        });

        await votoRepo.save(nuevoVoto);
        // Respuesta exitosa
        return res.status(201).json({ message: "Voto emitido con éxito", voto: nuevoVoto });

    } catch (error) {
    console.error ("Error en voto.controller.js -> emitirVoto(): ", error);
    res.status(500).json({ message: "Error al emitir el voto" });  
    }
}

// Contar votos de una votación por opción
export async function contarVotosPorOpcion(req, res) {
    try {
        const idVotacion = parseInt(req.params.id); // Toma el id que llega por la URL
        if (isNaN(idVotacion)){ // Verifica si el ID es un número válido isNaN función de JavaScript que verifica si un valor es NaN (Not a Number)
            return res.status(400).json({ message: "ID de votación inválido" });
        }
        // Repositorio de votos
        const votoRepo = AppDataSource.getRepository(VotoEntity);

        // Contar votos por opción
        const conteo = await votoRepo 
            .createQueryBuilder("voto") // Crea consulta personalizada sobre la tabla voto y le pone un alias "voto"
            .select("voto.opcion_elegida", "opcion") // Quiero mostrar la opción elegida y le llamare opcion
            .addSelect("COUNT(voto.id)", "cantidad") // Contar la cantidad de votos por opción y le llamo cantidad
            .where("voto.votacion.id = :idVotacion", { idVotacion }) // Filtro para que solo cuente los votos de la votación con el ID idVotacion
            .groupBy("voto.opcion_elegida") // Agrupa los resultados por la opción elegida
            .getRawMany(); // Ejecuta la consulta y obtiene los resultados

        res.status(200).json({ votacion: idVotacion, resultados: conteo}); // Respuesta con los resultados del conteo

    } catch (error) {
        console.error("Error en voto.controller.js -> contarVotosPorOpcion(): ", error);
        res.status(500).json({ message: "Error al contar los votos por opción" });
    }
}