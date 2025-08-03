import { useEffect, useRef } from "react";
import DataTable from "datatables.net";
import "../styles/meeting.css";

const TablaReuniones = ({ reuniones = [], onEliminar, onEditar, onAsistencia, onCrearActa }) => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (!tableElement) return;

    if (dataTableRef.current) {
      dataTableRef.current.destroy();
    }

    if (reuniones.length > 0) {
      dataTableRef.current = new DataTable(tableElement, {
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
        pageLength: 5,
        lengthChange: false,
        destroy: true,
      });
    }

    // Delegación de eventos para botones
    const handleClick = (e) => {
      const row = e.target.closest("tr");
      if (!row) return;

      const id = parseInt(row.querySelector("td")?.textContent);
      if (!id) return;

      if (e.target.closest(".meeting-asistencia-btn")) {
        onAsistencia(id);
      } else if (e.target.closest(".meeting-edit-btn")) {
        const reunion = reuniones.find((r) => r.id === id);
        if (reunion) onEditar(reunion);
      } else if (e.target.closest(".meeting-delete-btn")) {
        if (confirm("¿Estás seguro de eliminar esta reunión?")) {
          onEliminar(id);
        }
      } else if (e.target.closest(".meeting-acta-btn")) {
        const reunion = reuniones.find((r) => r.id === id);
        if (reunion) onCrearActa(reunion);
      }
    };

    tableElement.addEventListener("click", handleClick);

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
      tableElement.removeEventListener("click", handleClick);
    };
  }, [reuniones, onAsistencia, onEditar, onEliminar, onCrearActa]);

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
              <th>Fecha</th>
              <th>Hora</th>
              <th>Lugar</th>
              <th>Modalidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reuniones.map((reunion) => (
              <tr key={reunion.id}>
                <td>{reunion.id}</td>
                <td>{new Date(reunion.fecha).toLocaleDateString()}</td>
                <td>{reunion.hora}</td>
                <td>{reunion.lugar}</td>
                <td>{reunion.modalidad}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="meeting-button meeting-edit-btn">
                      Editar
                    </button>
                    <button className="meeting-button meeting-delete-btn">
                      Eliminar
                    </button>
                    <button className="meeting-button meeting-asistencia-btn">
                      Asistencia
                    </button>
                    <button
                      className="meeting-button meeting-acta-btn"
                      onClick={() => onCrearActa(reunion)}
                       disabled={!!reunion.acta}
                    >
                      Crear Acta
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaReuniones;
