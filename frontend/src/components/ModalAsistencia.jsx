import { useEffect } from "react";
import useGetAttendance from "../hooks/meeting/useGetAttendanceByMeetingId";
import useToggleAttendance from "../hooks/meeting/useToggleAttendance";

const ModalAsistencia = ({ meetingId, isOpen, onClose }) => {
  const { attendanceList, fetchAttendance } = useGetAttendance();
  const { toggleAttendance } = useToggleAttendance();

  useEffect(() => {
    if (isOpen) {
      fetchAttendance(meetingId);
    }
  }, [isOpen, meetingId, fetchAttendance]);

  const handleToggle = async (userId, currentFirma) => {
    try {
      await toggleAttendance(meetingId, userId, !currentFirma);
      fetchAttendance(meetingId);
    } catch (err) {
      console.error("Error al actualizar asistencia:", err);
      alert("Hubo un error al actualizar la asistencia.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="reuniones-title">Asistencia de la Reunión</h3>
        <div className="formulario-reunion asistencia-lista">
          {attendanceList.length === 0 ? (
            <p>No hay usuarios registrados en esta reunión.</p>
          ) : (
            <ul className="asistencia-ul">
              {attendanceList.map((item) => (
                <li key={item.usuario.id} className="asistencia-item">
                  <span>{item.usuario.firstName} {item.usuario.lastName}</span>
                  <input
                    type="checkbox"
                    checked={item.firma}
                    onChange={() => handleToggle(item.usuario.id, item.firma)}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onClose}
            className="meeting-button meeting-create-btn mt-4"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAsistencia;
