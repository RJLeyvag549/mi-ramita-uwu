import { useEffect, useState } from "react";
import useGetMeetings from "../hooks/meeting/useGetMeetings";
import useDeleteMeeting from "../hooks/meeting/useDeleteMeeting";
import useCreateMeeting from "../hooks/meeting/useCreateMeeting";
import useUpdateMeeting from "../hooks/meeting/useUpdateMeeting";
import useCreateAct from "../hooks/meeting/useCreateAct";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TablaReuniones from "../components/TablaReuniones";
import ModalAsistencia from "../components/ModalAsistencia";
import "../styles/meeting.css";

const initialForm = { 
  lugar: "",
  fecha: "",
  hora: "",
  modalidad: ""
};

const initialActaForm = {
  titulo: "",
  contenido: ""
};

function MeetingPage() {

  const { meetings, fetchMeetings } = useGetMeetings();
  const { createActa, loading } = useCreateAct();
  console.log("loading en MeetingPage:", loading);
  const { deleteMeeting } = useDeleteMeeting();
  const { createMeeting } = useCreateMeeting();
  const { updateMeeting } = useUpdateMeeting();

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [showAsistenciaModal, setShowAsistenciaModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [showCreateActaForm, setShowCreateActaForm] = useState(false);
  const [actaForm, setActaForm] = useState(initialActaForm);
  const [actaCreatingMeetingId, setActaCreatingMeetingId] = useState(null); 

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setMensaje("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      if (editingId) {
        await updateMeeting(editingId, form);
        setMensaje("Reunión actualizada exitosamente");
      } else {
        await createMeeting(form);
        setMensaje("Reunión creada exitosamente");
      }
      resetForm();
    } catch (err) {
      setError("Error al guardar la reunión");
    }
  };

  const handleEditar = (reunion) => {
    setForm({
      lugar: reunion.lugar,
      fecha: reunion.fecha.split("T")[0],
      hora: reunion.hora?.slice(0, 5),
      modalidad: reunion.modalidad
    });
    setEditingId(reunion.id);
    setShowForm(true);
    setMensaje("");
    setError("");
  };

  const handleEliminar = async (id) => {
    setMensaje("");
    setError("");
    try {
      await deleteMeeting(id);
      setMensaje("Reunión eliminada exitosamente");
    } catch (err) {
      setError("Error al eliminar la reunión");
    }
  };

  const handleVerAsistencia = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setShowAsistenciaModal(true);
  };

  const handleActaFormChange = (e) => {
    setActaForm({ ...actaForm, [e.target.name]: e.target.value });
  };

  const openCreateActaForm = (meetingId) => {
    setActaCreatingMeetingId(meetingId);
    setActaForm(initialActaForm);
    setShowCreateActaForm(true);
  };

  const closeCreateActaForm = () => {
    setShowCreateActaForm(false);
    setActaCreatingMeetingId(null);
    setActaForm(initialActaForm);
  };

  const handleCreateActaSubmit = async (e) => {
    e.preventDefault();
    try {
      await createActa(actaCreatingMeetingId, actaForm);
      alert("Acta creada exitosamente");
      fetchMeetings();
      closeCreateActaForm();
    } catch (error) {
      alert("Error al crear el acta");
    }
  };


  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <div className="reuniones-container">
            <div className="reuniones-header">
              <h2 className="reuniones-title">Gestión de Reuniones</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="meeting-button meeting-create-btn">
                  Crear Reunión
                </button>
              )}
            </div>

            {mensaje && <div className="mensaje-exito">{mensaje}</div>}
            {error && <div className="mensaje-error">{error}</div>}

            {showForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <form className="formulario-reunion" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="lugar"
                      placeholder="Lugar"
                      value={form.lugar}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="date"
                      name="fecha"
                      placeholder="Fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="time"
                      name="hora"
                      placeholder="Hora"
                      value={form.hora}
                      onChange={handleChange}
                      required
                    />
                    <select
                      name="modalidad"
                      value={form.modalidad}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione modalidad</option>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                    <div className="botones-formulario">
                      <button className="meeting-button meeting-create-btn" type="submit">
                        {editingId ? "Actualizar" : "Crear"}
                      </button>
                      <button className="meeting-button meeting-create-btn" type="button" onClick={resetForm}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <TablaReuniones
              reuniones={meetings}
              onEliminar={handleEliminar}
              onEditar={handleEditar}
              onAsistencia={handleVerAsistencia}
              onCrearActa={openCreateActaForm}
            />
            {/* Modal para crear acta */}
            {showCreateActaForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Crear Acta</h3>
                  <form onSubmit={handleCreateActaSubmit} className="form-crear-acta">
                    <input
                      type="text"
                      name="titulo"
                      placeholder="Título del acta"
                      value={actaForm.titulo}
                      onChange={handleActaFormChange}
                      required
                    />
                    <textarea
                      name="contenido"
                      placeholder="Contenido del acta"
                      value={actaForm.contenido}
                      onChange={handleActaFormChange}
                      rows={6}
                      required
                    />
                    <div className="botones-formulario">
                      <button type="submit" className="meeting-button meeting-create-btn">Crear Acta</button>
                      <button type="button" className="meeting-button meeting-cancel-btn" onClick={closeCreateActaForm}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}            
            {showAsistenciaModal && selectedMeetingId !== null && (
              <>
              {console.log("✅ Mostrando ModalAsistencia para ID:", selectedMeetingId)}
              <ModalAsistencia
                meetingId={selectedMeetingId}
                isOpen={showAsistenciaModal}
                onClose={() => {
                  console.log("❌ Cerrando ModalAsistencia");
                  setShowAsistenciaModal(false);
                }}
              />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingPage;
