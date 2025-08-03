//* ESTE ARCHIVO CREA EL CERTIFICADO DE RESIDENCIA

//* DEPENDENCIA PDF KIT: $ npm i pdfkit

"use strict";

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/configDb.js';
import User from '../entity/user.entity.js';

export async function PDFResidenceCertificate(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    if (!user) return [null, "Usuario no encontrado."];

    const { firstName, lastName, rut, homeAddress } = user;

    const currentDate = new Date();
    const months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];
    const formattedDate = `Concepción, ${currentDate.getDate()} de ${months[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

const doc = new PDFDocument({
  size: 'LETTER',
  margins: {
    top: 50,
    bottom: 50,
    left: 70,
    right: 50
  } 
});   

    const pdfBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      //* TÍTULO
      doc.font('Times-Bold')
        .fontSize(18)
        .text('CERTIFICADO RESIDENCIA', { align: 'center' });

      doc.font('Times-Roman'); 

      doc.moveDown(2);

      //* CUERPO
      doc.fontSize(14).text(
        'La Junta de Vecinos “junta vecinal pro”, Rut 65.062.063-1, Personalidad Jurídica N°618. De la comuna de Concepción,'
      );

      doc.moveDown(1);

      doc.text('Certifica que:');
      doc.moveDown(1);

      doc.text(`Señor(a) ${firstName} ${lastName}, RUT ${rut}, mantiene domicilio vigente en ${homeAddress}, Villa putos, comuna de Concepción.`);

      doc.moveDown(1);
      doc.text(
        'Se extiende el presente certificado a solicitud del interesado(a), con el propósito de acreditar su domicilio, para los fines que estime convenientes.'
      );

      doc.moveDown(1);
      doc.text('La validez de este certificado es de tres meses a contar de la fecha de su emisión.');

      doc.moveDown(2);
      doc.text(formattedDate);

      doc.moveDown(4);

//* FIRMA
const firmaPath = path.resolve('src/assets/firma.png');
if (fs.existsSync(firmaPath)) {
  const firmaAncho = 380;           //* TAMAÑO HORIZONTAL
  const firmaAlto =  170;           //* TAMAÑO VERTICAL

  const pageWidth = doc.page.width;
  const firmaOffset = 120; 
  const firmaX = (pageWidth - firmaAncho) / 2 + firmaOffset;

  doc.image(firmaPath, firmaX, doc.y, {
    fit: [firmaAncho, firmaAlto],
  });

} else {
  doc.moveDown(2);
}

doc.end();

    });

    return [pdfBuffer, null];

  } catch (error) {
    console.error("Error en PDFResidenceCertificate:", error);
    return [null, "Error al generar el certificado"];
  }
}
