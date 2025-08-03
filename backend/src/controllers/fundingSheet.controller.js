import Funding from "../entity/funding.entity.js";
import { AppDataSource } from "../config/configDb.js";
import ExcelJS from "exceljs";

export async function exportFundingSheet(req, res) {
  try {
    const fundingRepository = AppDataSource.getRepository(Funding);
    const fundings = await fundingRepository.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Acreditaciones");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "name", width: 30 },
      { header: "Monto", key: "amount", width: 15 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "Estado", key: "status", width: 20 },
      { header: "Creado", key: "createdAt", width: 20 },
      { header: "Actualizado", key: "updatedAt", width: 20 },
    ];

    fundings.forEach(funding => {
      worksheet.addRow({
        id: funding.id,
        name: funding.name,
        amount: funding.amount,
        date: funding.date,
        status: funding.status,
        createdAt: funding.createdAt,
        updatedAt: funding.updatedAt,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=acreditaciones_fondos.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar la planilla de fondos: ", error);
    res.status(500).json({ message: "Error al generar la planilla." });
  }
}