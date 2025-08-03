"use strict";
import Votacion, { VotacionEntity } from "../entity/votacion.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm"; // para ver votación actualmente disponible
import { votacionValidation, votacionUpdateValidation} from "../validations/votacion.validation.js";

// Crear Votación
export const createVotacion = async (req, res) => {
    try {
    const { error } = votacionValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    const {
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        opciones,
    } = req.body;

    const nuevaVotacion = AppDataSource.getRepository(VotacionEntity).create({
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        opciones,
        creada_por: req.user.rut, // usa el rut
    });

    const resultado = await AppDataSource.getRepository(VotacionEntity).save(nuevaVotacion);
    res.status(201).json(resultado);
    
    } catch (error) {
    console.error("Error en votaciones.controller.js -> createVotacion(): ", error);
    res.status(500).json({ message: "Error al crear la votación" });
    }
};
// Ver TODAS las votaciones (para Admin) PONER MIDDLEWARE QUE REVISE SI USUARIO ES ADMIN O NO
export async function getAllVotaciones(req, res){
    try {
        const votacionRepo = AppDataSource.getRepository(VotacionEntity);
        const votaciones = await votacionRepo.find();

        res.status(200).json({ message: "Todas las votaciones", data: votaciones });
    } catch (error) {
        console.error("Error en votaciones.controller.js -> getAllVotaciones(): ", error);
        res.status(500).json({ message: "Error interno del servidor."});
    }
}

// Ver votaciones disponibles (para todos)
export async function getVotacionesDisp(req, res) {
    try {
        const ahora = new Date();
        console.log("Fecha y hora actual:", ahora.toISOString());
        const votacionRepo = AppDataSource.getRepository(VotacionEntity);

        const disponibles = await votacionRepo.find({
            where: {
                fecha_inicio: LessThanOrEqual(ahora),
                fecha_fin: MoreThanOrEqual(ahora),
            },
        });

        res.status(200).json({ message: "Votaciones disponibles: ", data: disponibles });
    } catch (error) {
        console.error("Error en votaciones.controller.js -> getVotacionesDisp(): ", error);
        
    }
}

// Actualizar Votación
export async function updateVotacionById(req, res){
    try {
        const { error } = votacionUpdateValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const ahora = new Date();
        // Obtener repositorio de votaciones y buscar votacion por ID
        const votacionRepo = AppDataSource.getRepository(Votacion);
        const { id } = req.params;
        const { titulo, descripcion, fecha_inicio, fecha_fin, opciones } = req.body; // duda si puede cambiar fecha_inicio
        const votacion = await votacionRepo.findOne({ where: { id }});

        // Si no encuentra la votacion, devolver error 404
        if(!votacion){
            return res.status(404).json({ message: "Votación no encontrada."});
        }
        // Si ya finalizó, no permitir editar
        if (new Date(votacion.fecha_fin) < ahora) {
            return res.status(400).json({ message: "No se puede editar una votación que ya finalizó." });
        }
        // Validar que al menos uno de los campos a actualizar esté presente
        votacion.titulo = titulo || votacion.titulo;
        votacion.descripcion = descripcion || votacion.descripcion;
        // Permitir cambiar fecha_inicio solo si aún no ha comenzado
        if (fecha_inicio && new Date(votacion.fecha_inicio) > ahora) {
            votacion.fecha_inicio = fecha_inicio;
        }
        votacion.fecha_fin = fecha_fin || votacion.fecha_fin;
        votacion.opciones = opciones || votacion.opciones;
        votacion.editada_en = new Date(); // Establece la fecha actual

        // Validar que fecha_inicio < fecha_fin
        if (new Date(votacion.fecha_inicio) >= new Date(votacion.fecha_fin)) {
            return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin." });
        }

        //Guardar los cambios en la base de datos
        await votacionRepo.save(votacion);

        res.status(200).json({ message: "Votacion actualizada exitosamente.", data: votacion});
    } catch (error) {
        console.error("Error en votaciones.controller.js -> updateVotacionById(): ", error);
        res.status(500).json({ message: "Error interno del servidor."});       
    }
}

// Eliminar votación
export async function deleteVotacionById(req, res) {
    try {
        const votacionRepo = AppDataSource.getRepository(Votacion);
        const { id } = req.params;

        // Buscar votación por ID
        const votacion = await votacionRepo.findOne({ where: { id }});

        if(!votacion) {
            return res.status(404).json({ message: "Votación no encontrada."});
        }
        /* Verificar si la votación ya está activa (PREGUNTAR SI SE PUEDE BORRAR UNA VOTACIÓN CUANDO SIGUE ACTIVA  (CON TIEMPO)
        const ahora = new Date();
        if (votacion.fecha_inicio <= ahora) {
            return res.status(400).json({ message: "No se puede eliminar una votacion activa o pasada."})
        }
        */
        
        
        // Eliminar votación
        await votacionRepo.remove(votacion);

        res.status(200).json({ message: "Votación eliminada exitosamente."});
    } catch (error) {
        console.error("Error en votacion.controller.js -> deleteVotacionById(): ", error);
        res.status(500).json({ message: "Error interno del servidor."});
        
    }
    
}
