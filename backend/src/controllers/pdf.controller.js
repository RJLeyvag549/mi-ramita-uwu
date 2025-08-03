//* ESTE ARCHIVO ES PARA EL CERTIFICADO DE RESIDENCIA

"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { PDFResidenceCertificate } from "../services/pdf.service.js";

export async function getResidenceCertificate(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const user = await userRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const [pdfBuffer, error] = await PDFResidenceCertificate(user);

    if (error) {
      return res.status(500).json({ message: "Error al generar certificado" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=certificado_residencia.pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error en pdf.controller.js -> getResidenceCertificate():", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}