"use strict";
export function validarOpcionElegida(votacion, opcionElegida) {
    const opcionLimpia = opcionElegida.trim();
    const opcionesValidas = votacion.opciones.map(o => o.trim());

    if (!opcionesValidas.includes(opcionLimpia)) {
        return {
            esValido: false,
            mensaje: `La opción '${opcionLimpia}' no es válida para esta votación`,
            opciones_validas: opcionesValidas,
        };
    }

    return { esValido: true };
}
