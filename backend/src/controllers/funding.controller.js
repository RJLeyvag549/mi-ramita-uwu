"use strict";
import Funding from "../entity/funding.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { fundingValidation } from "../validations/funding.validation.js";

export async function createFunding(req, res) {
  try {
    const fundingRepository = AppDataSource.getRepository(Funding);
    const { name, amount, date, status } = req.body;
    const { error } = fundingValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    const comprobante = req.file ? `upload/${req.file.filename}` : null;
    const newFunding = fundingRepository.create({name, amount, date, status, comprobante});
    if (!req.file) {
      return res.status(400).json({ message: "Debe adjuntar un comprobante de la acreditación aceptada." });
    }
    console.log("Datos a guardar:", { name, amount, date, status, comprobante });
    await fundingRepository.save(newFunding);

    res.status(201).json({ message: "Acreditación creada exitosamente", data: newFunding });
  } catch (error) {
    console.error("Error en funding.controller.js -> createFunding(): ", error);
    res.status(500).json({ message: "Error al crear la acreditación" });
  }
}

export async function getFunding(req, res) {
  try {
    const fundingRepository = AppDataSource.getRepository(Funding);
    const fundings = await fundingRepository.find();

    res.status(200).json({ message: "Acreditaciones encontradas", data: fundings });
  } catch (error) {
    console.error("Error en funding.controller.js -> getFunding(): ", error);
    res.status(500).json({ message: "Error al obtener las acreditaciones" });
  }
}

export async function updateFunding(req, res) {
  try {
    const fundingRepository = AppDataSource.getRepository(Funding);
    const { id } = req.params;
    const funding = await fundingRepository.findOne({ where: { id } });

    if (!funding) {
      return res.status(404).json({ message: "Acreditación no encontrada" });
    }

    const { error, value } = fundingValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, amount, date, status, comprobante } = value;
    funding.name = name || funding.name;
    funding.amount = amount || funding.amount;
    funding.date = date || funding.date;
    funding.status = status || funding.status;
    funding.comprobante = comprobante || funding.comprobante;

    await fundingRepository.save(funding);

    res.status(200).json({ message: "Acreditación actualizada exitosamente", data: funding });
  } catch (error) {
    console.error("Error en funding.controller.js -> updateFunding(): ", error);
    res.status(500).json({ message: "Error al actualizar la acreditación" });
  }
}

export async function deleteFunding(req, res) {
  try {
    const fundingRepository = AppDataSource.getRepository(Funding);
    const { id } = req.params;
    const funding = await fundingRepository.findOne({ where: { id } });

    if (!funding) {
      return res.status(404).json({ message: "Acreditación no encontrada" });
    }

    await fundingRepository.remove(funding);

    res.status(200).json({ message: "Acreditación eliminada exitosamente" });
  } catch (error) {
    console.error("Error en funding.controller.js -> deleteFunding(): ", error);
    res.status(500).json({ message: "Error al eliminar la acreditación" });
  }
}

