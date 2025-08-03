"use strict";
import Meeting from "../entity/meeting.entity.js";
import Attendance from "../entity/attendance.entity.js";
import Act from "../entity/meeting_act.entity.js";
import { Between } from "typeorm";
import { AppDataSource } from "../config/configDb.js";
import { generateAttendanceForMeeting } from "./attendance.controller.js";
import { createMeetingValidation, updateMeetingValidation, getMeetingByIdValidation, rangeDateSchema } from "../validations/meeting.validation.js";

export async function createMeeting(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { lugar, fecha, hora, modalidad } = req.body;
    const { error } = createMeetingValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existingFechaMeeting = await meetingRepository.findOne({
      where: { fecha },
    });
    if (existingFechaMeeting)
      return res.status(409).json({ message: "Reunion ya registrado." });

    const newMeeting = meetingRepository.create({
      lugar,
      fecha,
      hora,
      modalidad
    });
    await meetingRepository.save(newMeeting);
    await generateAttendanceForMeeting(newMeeting.id);

    res.status(201).json({ message: "Reunion creada exitosamente!", data: newMeeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> create(): ", error);
    return res.status(500).json({ message: "Error al crear la reunion" });
  }
}

export async function getMeetings(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const meetings = await meetingRepository.find();

    res.status(200).json({ message: "Reuniones encontradas: ", data: meetings });
  } catch (error) {
    console.error("Error en meeting.controller.js -> getMeetings(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getMeetingById(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const { error } = getMeetingByIdValidation.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });

    const meeting = await meetingRepository.findOne({ where: { id } });

    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrada." });
    }

    res.status(200).json({ message: "Reunion encontrada: ", data: meeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> getMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function updateMeetingById(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const { lugar, fecha, hora, modalidad} = req.body;
    const { error } = updateMeetingValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const meeting = await meetingRepository.findOne({ where: { id } });

    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrada." });
    }

    meeting.lugar = lugar || meeting.lugar;
    meeting.fecha = fecha || meeting.fecha;
    meeting.hora = hora || meeting.hora;
    meeting.modalidad = modalidad || meeting.modalidad;

    await meetingRepository.save(meeting);

    res
      .status(200)
      .json({ message: "Reunion actualizado exitosamente.", data: meeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> updateMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function deleteMeetingById(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const { error } = getMeetingByIdValidation.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
  
    const meeting = await meetingRepository.findOne({ where: { id } });

    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrado." });
    }

    const attendanceRepository = AppDataSource.getRepository(Attendance);
    await attendanceRepository.delete({ reunion: { id } });
    const actRepository = AppDataSource.getRepository(Act);
    await actRepository.delete({ reunion: { id } });
    await meetingRepository.remove(meeting);

    res.status(200).json({ message: "Reunion eliminada exitosamente." });
  } catch (error) {
    console.error("Error en meeting.controller.js -> deleteMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
//aun falta terminar, ingresar aÃ±o y mes de busqueda
export async function getMeeting(req, res) {
  try {
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { error, value } = rangeDateSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { anio, mes } = value;
    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 0, 23, 59, 59, 999);
    
    const meetings = await meetingRepository.find({
      where: { fecha: Between(fechaInicio, fechaFin )}
    });

    if (meetings.length === 0) {
      return res.status(404).json({ message: "No se encontraron reuniones en ese mes." });
    }

    const formattedMeetings = meetings.map(meeting => ({
      id: meeting.id,
      lugar: meeting.lugar,
      fecha: meeting.fecha,
      hora: meeting.hora,
      modalidad: meeting.modalidad
    }));

    res.status(200).json({ message: "Reuniones encontradas: ", data: formattedMeetings });
  } catch (error) {
    console.error("Error en meeting.controller -> getMeeting(): ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}