"use strict"

import { AppDataSource } from "../config/configDb.js";
import Attendance from "../entity/attendance.entity.js";
import User from "../entity/user.entity.js";
import Meeting from "../entity/meeting.entity.js";
import { checkAttendanceValidation, getAttendanceByMeetingIdValidation } from "../validations/attendance.validation.js";

export async function generateAttendanceForMeeting(meetingId) {
  const userRepository = AppDataSource.getRepository(User);
  const attendanceRepository = AppDataSource.getRepository(Attendance);
  const meetingRepository = AppDataSource.getRepository(Meeting);

  const meeting = await meetingRepository.findOneBy({ id: meetingId });
  if (!meeting) return;

  const usuarios = await userRepository.find();

  const newList = usuarios.map(user => {
    return attendanceRepository.create({
      reunion: meeting,
      usuario: user,
      firma: false
    });
  });

  await attendanceRepository.save(newList);
}

export async function getAttendanceByMeetingId(req, res) {
  try {
    const { id } = req.params;
    const { error } = getAttendanceByMeetingIdValidation.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });

    const meetingRepository = AppDataSource.getRepository(Meeting);
    const meeting = await meetingRepository.findOneBy({ id: Number(id) });

    if (!meeting) {
      return res.status(404).json({ message: "Reunión no encontrada." });
    }
    const attendanceRepository = AppDataSource.getRepository(Attendance);

    const lista = await attendanceRepository.find({
      where: { reunion: { id: id } },
      relations: ["usuario"]
    });

    const resultado = lista.map(a => ({
      id: a.id,
      firma: a.firma,
      usuario: a.usuario  
    }));

    res.status(200).json({
      message: `Asistencia para reunión ${id}`,
      data: resultado
    });
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function checkAttendance(req, res) {
  try {
    const { meetingId, userId } = req.params;
    const { firma } = req.body;
    
    const { error: paramsError } = checkAttendanceValidation.params.validate(req.params);
    if (paramsError) return res.status(400).json({ message: paramsError.message });
    const { error: bodyError } = checkAttendanceValidation.body.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.message });

    const meetingRepository = AppDataSource.getRepository(Meeting);
    const userRepository = AppDataSource.getRepository(User);
    const attendanceRepository = AppDataSource.getRepository(Attendance);

    const meeting = await meetingRepository.findOneBy({ id: meetingId });
    if (!meeting) { return res.status(404).json({ message: `No existe reunión con id ${meetingId}` })};
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) { return res.status(404).json({ message: `No existe usuario con id ${userId}` })};

    const registro = await attendanceRepository.findOne({
      where: {
        reunion: { id: meetingId },
        usuario: { id: userId },
      },
      relations: ["usuario", "reunion"],
    });

    if (!registro) {
      return res.status(404).json({ message: "Registro de asistencia no encontrado para esta reunión y usuario." });
    }

    registro.firma = firma;
    await attendanceRepository.save(registro);

    return res.status(200).json({ message: "Asistencia actualizada", data: registro });
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
