//* ESTA FUNCIÓN ES PARA AGRUPAR LOS ERRORES EN LOS DETAILS

export function groupErrorsByField(detailsArray) {
  const grouped = {};

  for (const err of detailsArray) {
    const field = err.path.join('.');
    if (!grouped[field]) {
      grouped[field] = [];
    }
    grouped[field].push(err.message);
  }

  return grouped;
}
