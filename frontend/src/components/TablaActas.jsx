import { useEffect, useRef } from "react";
import DataTable from "datatables.net";
import "../styles/meeting.css";

const TablaActas = ({ actas = [], onEditar, onVer, onFirmar }) => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (!tableElement) {
      console.error("❌ No se encontró el elemento de tabla.");
      return;
    }

    // Destruir DataTable anterior si existe
    try {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    } catch (error) {
      console.error("💥 Error al destruir el DataTable:", error);
    }

    // Montar DataTable solo si hay actas
    if (actas.length > 0) {
      try {
        dataTableRef.current = new DataTable(tableElement, {
          data: actas.map((acta) => [
            acta.id,
            acta.titulo,
            acta.firma ? "Sí" : "No",
            acta, // Pasamos el objeto acta para usarlo en render
          ]),
          columns: [
            { title: "ID" },
            { title: "Título" },
            { title: "Firmada" },
            {
              title: "Acciones",
              orderable: false,
              searchable: false,
              render: function (data, type, row) {
                // data es el objeto acta
                const id = row[0];
                const firmado = row[2] === "Sí";
                return `
                  <div class="flex gap-2">
                    <button class="meeting-button acta-ver-btn" data-id="${id}">Ver</button>
                    <button class="meeting-button acta-edit-btn" data-id="${id}">Editar</button>
                    ${
                      !firmado
                        ? `<button class="meeting-button acta-sign-btn" data-id="${id}">Firmar</button>`
                        : `<span class="text-green-700 font-bold">Firmada</span>`
                    } 
                  </div>
                `;
              },
            },
          ],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
          pageLength: 5,
          lengthChange: false,
          destroy: true,
        });
      } catch (error) {
        console.error("💥 Error al montar la DataTable:", error);
      }
    }

    // Handler para los botones de acción
    const handleClick = (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      const id = parseInt(btn.getAttribute("data-id"));
      if (!id) return;
      const acta = actas.find((a) => a.id === id);
      if (!acta) return;

      if (btn.classList.contains("acta-ver-btn")) {
        onVer(acta);
      } else if (btn.classList.contains("acta-edit-btn")) {
        onEditar(acta);
      } else if (btn.classList.contains("acta-sign-btn")) {
        if (window.confirm("¿Deseas firmar esta acta?")) {
          onFirmar(acta.meetingId);
        }
      }
    };

    tableElement.addEventListener("click", handleClick);

    return () => {
      try {
        if (dataTableRef.current) {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        }
      } catch (error) {
        console.error("💥 Error en cleanup:", error);
      }
      tableElement.removeEventListener("click", handleClick);
    };
  }, [actas, onVer, onEditar, onFirmar]);

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="display w-full text-sm text-left"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Firmada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Deja vacío, DataTable lo llenará */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaActas;