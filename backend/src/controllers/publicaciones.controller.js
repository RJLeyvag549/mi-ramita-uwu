"use strict";
import { publicacionesEntity } from "../entity/publicaciones.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/publicaciones.validation.js";
import { updateValidation } from "../validations/publicaciones.validation.js";



export async function getPublicaciones(req,res) { //Declara una función asíncrona que será exportada para ser usada en los routes
//& req: la solicitud del cliente
    try{
        const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity); // TypeORM para obtener el repositorio de la entidad publicacionesEntity
        const publicaciones = await publicacionesRepository.find();//Espera a que la base de datos termine de buscar todas las publicaciones, y guarda el resultado en la variable publicaciones

//& res: la respuesta del servidor
        res.status(200).json({ message: "Publicaciones encontradas: ", data: publicaciones})
    }catch (error) {
        console.error(" Error al obtener la publicación: ", error);
        res.status(500).json({ message: "Error al obtener la publicación."}); //Error interno (500)
    }
    
  }

export async function createPublicaciones(req, res) {
  try {
    const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity);

    const { titulo, contenido, tipo_de_publicacion } = req.body;
    const { error } = createValidation.validate(req.body);
    if (error)
      return res.status(400).json({
        message: "Error al crear una publicación",
        error: error,
      });

    const newpublicacion = publicacionesRepository.create({
      titulo,
      contenido,
      tipo_de_publicacion,
    });

    await publicacionesRepository.save(newpublicacion);

    res.status(201).json({
      message: "Publicación creada exitosamente",
      data: newpublicacion,
    });

  } catch (error) {
    console.error("Error al crear publicación: ", error);
    res.status(500).json({
      message: "Error al crear publicación.",
      error: error.message,
      stack: error.stack,
    });
  }
}


// Editar contenido de una publicación
export async function updatePublicacion(req, res) {
  try {
    const { id_publicacion } = req.params;
    const { contenido, titulo } = req.body; // ← ahora también recibe título

    const repo = AppDataSource.getRepository(publicacionesEntity);
    const publicacion = await repo.findOneBy({ id_publicacion: Number(id_publicacion) });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Validar solo si hay algo que actualizar
    const { error } = updateValidation.validate({ contenido, titulo });
    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        detalle: error.details[0]?.message,
        campo: error.details[0]?.context?.key,
      });
    }

    // Solo actualiza si el campo viene en el body
    if (contenido !== undefined) publicacion.contenido = contenido;
    if (titulo !== undefined) publicacion.titulo = titulo;

    await repo.save(publicacion);

    res.status(200).json({
      message: "Publicación actualizada",
      data: publicacion,
    });

  } catch (error) {
    console.error("Error al actualizar publicación:", error);
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
}



export async function getPublicacionConComentarios(req, res) {
  try {
    const { id_publicacion } = req.params;

    const repo = AppDataSource.getRepository(publicacionesEntity);

    const publicacion = await repo.findOne({
      where: { id_publicacion: parseInt(id_publicacion) },
      relations: ["comentarios"], // <--- Esto carga los comentarios asociados
    });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({
      message: "Publicación encontrada con comentarios",
      data: publicacion,
    });

  } catch (error) {
    console.error("Error al obtener publicación con comentarios:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
}

export async function deletePublicacion(req, res) {
  try {
    const { id_publicacion } = req.params;
    const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity);

    const publicacion = await publicacionesRepository.findOneBy({ id_publicacion: parseInt(id_publicacion) });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    await publicacionesRepository.remove(publicacion);

    res.status(200).json({ message: "Publicación eliminada exitosamente" });

  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ message: "Error interno al eliminar publicación", error: error.message });
  }
}



