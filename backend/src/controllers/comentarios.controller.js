"use strict";

import { UserEntity } from "../entity/user.entity.js";
import { ComentariosEntity } from "../entity/comentarios.entity.js";
import { publicacionesEntity } from "../entity/publicaciones.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createComentarioValidation,
  updateComentarioValidation
} from "../validations/comentarios.validation.js";

export async function createComentario(req, res) {
  try {
    const { id_publicacion } = req.params;
    const { contenido } = req.body; // ← ahora usamos "contenido"
    const id_usuario = req.user?.id;

    if (!id_usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { error } = createComentarioValidation.validate({ contenido });
    if (error) {
      const detalle = error.details[0]?.message || "Comentario inválido";
      return res.status(400).json({
        message: "Error de validación en comentario",
        detalle,
        campo: error.details[0]?.context?.key,
      });
    }

    const comentarioRepo = AppDataSource.getRepository(ComentariosEntity);
    const publicacionRepo = AppDataSource.getRepository(publicacionesEntity);
    const userRepo = AppDataSource.getRepository(UserEntity);

    const publicacion = await publicacionRepo.findOneBy({ id_publicacion });
    if (!publicacion) {
      return res.status(404).json({
        message: "Error: no se encontró la publicación con el id especificado",
        id_publicacion,
      });
    }

    const usuario = await userRepo.findOneBy({ id: id_usuario });
    if (!usuario) {
      return res.status(404).json({
        message: "Error: el usuario autenticado no existe en la base de datos",
        id_usuario,
      });
    }

    const nuevoComentario = comentarioRepo.create({
      contenido,
      publicacion,
      user: usuario,
    });

    await comentarioRepo.save(nuevoComentario);

    res.status(201).json({
      message: "Comentario creado exitosamente",
      data: nuevoComentario,
    });

  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
}

export async function deleteComentario(req, res) { // solo el usuario puede eliminar SUS comentarios, no los de otros
  try {
    const { id_comentario } = req.params;
    const id_usuario = req.user?.id;

    if (!id_usuario) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const comentarioRepo = AppDataSource.getRepository(ComentariosEntity);

    const comentario = await comentarioRepo.findOne({
      where: { id_comentario: parseInt(id_comentario) },
      relations: ["user"]
    });

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Solo el dueño puede eliminar su comentario
    if (comentario.user.id !== id_usuario) {
      return res.status(403).json({ message: "No autorizado para eliminar este comentario" });
    }

    await comentarioRepo.remove(comentario);
    res.status(200).json({ message: "Comentario eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
}


export async function getComentariosByPublicacion(req, res) {
  try {
    const { id_publicacion } = req.params;
    const comentarioRepo = AppDataSource.getRepository(ComentariosEntity);

    const comentarios = await comentarioRepo.find({
      where: { publicacion: { id_publicacion: Number(id_publicacion) } },
      relations: ["user"],
      order: { fecha_comentario: "DESC" }
    });

    res.status(200).json({ data: comentarios });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getComentarioById(req, res) {
  try {
    const { id_comentario } = req.params;
    const comentarioRepo = AppDataSource.getRepository(ComentariosEntity);

    const comentario = await comentarioRepo.findOne({
      where: { id_comentario: Number(id_comentario) }, //Busca los comentarios donde la publicación asociada tenga el id igual al recibido
      relations: ["user"]
    });

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.status(200).json({ data: comentario });
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function updateComentario(req, res) {
  try {
    const { id_comentario } = req.params;
    const { contenido } = req.body;
    const id_usuario = req.user.id;

    const { error } = updateComentarioValidation.validate({ contenido });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const comentarioRepo = AppDataSource.getRepository(ComentariosEntity);
    const comentario = await comentarioRepo.findOne({
      where: { id_comentario },
      relations: ["user"]
    });

    if (!comentario)
      return res.status(404).json({ message: "Comentario no encontrado" });

    if (comentario.user.id !== id_usuario)
      return res.status(403).json({ message: "No autorizado para editar este comentario" });

    comentario.contenido = contenido;
    await comentarioRepo.save(comentario);

    res.status(200).json({ message: "Comentario actualizado", data: comentario });
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
