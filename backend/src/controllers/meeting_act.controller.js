"use strict"

import { AppDataSource } from "../config/configDb.js";
import Meeting from "../entity/meeting.entity.js";
import Act from "../entity/meeting_act.entity.js";
import { meetingActValidation } from "../validations/meeting_act.validation.js";

export async function createAct(req, res) {
  try {
    const { meetingId } = req.params;
    const { titulo, contenido } = req.body;
    const { error: paramsError } = meetingActValidation.params.validate(req.params);
    if (paramsError) return res.status(400).json({ message: paramsError.message });
    const { error: bodyError } = meetingActValidation.body.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.message });

    const actRepository = AppDataSource.getRepository(Act);
    const meetingRepository = AppDataSource.getRepository(Meeting);

    const meeting = await meetingRepository.findOneBy({ id: Number(meetingId) });
    if (!meeting) {
      return res.status(404).json({ message: "Reunión no encontrada." });
    }

    const existingActa = await actRepository.findOne({
      where: { reunion: { id: meetingId } },
    });
    if (existingActa) {
      return res.status(409).json({ message: "Ya existe un acta para esta reunión." });
    }

    const newAct = actRepository.create({
      titulo,
      contenido,
      reunion: meeting
    });

    await actRepository.save(newAct);
    return res.status(201).json({ message: "Acta creada exitosamente.", data: newAct });
  } catch (error) {
    console.error("Error en createAct():", error);
    return res.status(500).json({ message: "Error al crear el acta." });
  }
}

export async function getActByMeetingId(req, res) {
  try {
    const { meetingId } = req.params;
    const { error: paramsError } = meetingActValidation.params.validate(req.params);
    if (paramsError) return res.status(400).json({ message: paramsError.message });

    const actRepository = AppDataSource.getRepository(Act);
    const act = await actRepository.findOne({
      where: { reunion: { id: Number(meetingId) } },
      relations: ["reunion"],
    });

    if (!act) {
      return res.status(404).json({ message: "Acta no encontrada para esta reunión." });
    }

    return res.status(200).json({ message: "Acta encontrada.", data: act });
  } catch (error) {
    console.error("Error en getActByMeetingId():", error);
    return res.status(500).json({ message: "Error al obtener el acta." });
  }
}

export async function updateAct(req, res) {
  try {
    const { meetingId } = req.params;
    const { titulo, contenido } = req.body;
    const { error: paramsError } = meetingActValidation.params.validate(req.params);
    if (paramsError) return res.status(400).json({ message: paramsError.message });
    const { error: bodyError } = meetingActValidation.body.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.message });


    const actRepository = AppDataSource.getRepository(Act);
    const act = await actRepository.findOne({
      where: { reunion: { id: Number(meetingId) } },
      relations: ["reunion"],
    });

    if (!act) {
      return res.status(404).json({ message: "Acta no encontrada para esta reunión." });
    }

    act.titulo = titulo || act.titulo;
    act.contenido = contenido || act.contenido;

    await actRepository.save(act);
    return res.status(200).json({ message: "Acta actualizada.", data: act });
  } catch (error) {
    console.error("Error en updateAct():", error);
    return res.status(500).json({ message: "Error al actualizar el acta." });
  }
}


export async function signAct(req, res) {
  try {
    const { meetingId } = req.params;
    const { error: paramsError } = meetingActValidation.params.validate(req.params);
    if (paramsError) return res.status(400).json({ message: paramsError.message });

    const actRepository = AppDataSource.getRepository(Act);
    const act = await actRepository.findOne({
      where: { reunion: { id: Number(meetingId) } },
    });

    if (!act) {
      return res.status(404).json({ message: "Acta no encontrada para esta reunión." });
    }

    if (act.firma) {
      return res.status(400).json({ message: "El acta ya está firmada." });
    }

    act.firma = true;
    await actRepository.save(act);

    return res.status(200).json({ message: "Acta firmada correctamente.", data: act });
  } catch (error) {
    console.error("Error en signAct():", error);
    return res.status(500).json({ message: "Error al firmar el acta." });
  }
}
