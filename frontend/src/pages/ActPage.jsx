import { useEffect, useState } from "react";
import useGetMeetingsWithActs from "../hooks/meeting/useGetMeetingsWithActs";
import useCreateActa from "../hooks/meeting/useCreateAct";
import useUpdateActa from "../hooks/meeting/useUpdateAct";
import useSignActa from "../hooks/meeting/useSignAct";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TablaActas from "../components/TablaActas";
import "../styles/acta.css";

const initialForm = {
  titulo: "",
  contenido: "",
};

const ActPage = () => {
  const { meetingsWithActs, fetchMeetingsWithActs } = useGetMeetingsWithActs();
  const { createActa } = useCreateActa();
  const { updateActa } = useUpdateActa();
  const { signActa } = useSignActa();

  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [actaSeleccionada, setActaSeleccionada] = useState(null);

  useEffect(() => {
    fetchMeetingsWithActs();
  }, [fetchMeetingsWithActs]);

  useEffect(() => {
    if (Array.isArray(meetingsWithActs)) {
      const conActas = meetingsWithActs.filter((m) => m && m.acta !== null);
      console.log(`📥 Reuniones recibidas: ${meetingsWithActs.length}, con actas: ${conActas.length}`);
    }
  }, [meetingsWithActs]);

  const resetForm = () => {
    setForm(initialForm);
    setEditing(false);
    setShowForm(false);
    setSelectedMeetingId(null);
    setMensaje("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrear = (meetingId) => {
    resetForm();
    setSelectedMeetingId(meetingId);
    setShowForm(true);
  };

  const handleEditar = (acta, meetingId) => {
    if (!acta) return;
    setForm({
      titulo: acta.titulo ?? "",
      contenido: acta.contenido ?? "",
    });
    setSelectedMeetingId(meetingId);
    setEditing(true);
    setShowForm(true);
  };

  const handleVer = (acta) => {
    if (!acta) return;
    setActaSeleccionada(acta);
    setShowViewModal(true);
  };

  const handleFirmar = async (meetingId) => {
    try {
      await signActa(meetingId);
      setMensaje("Acta firmada correctamente");
      fetchMeetingsWithActs();
    } catch (err) {
      setError("Error al firmar el acta");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMeetingId) {
      setError("Debes seleccionar una reunión.");
      return;
    }

    try {
      if (editing) {
        await updateActa(selectedMeetingId, form);
        setMensaje("Acta actualizada exitosamente");
      } else {
        await createActa(selectedMeetingId, form);
        setMensaje("Acta creada exitosamente");
      }
      fetchMeetingsWithActs();
      resetForm();
    } catch (err) {
      setError("Error al guardar el acta");
    }
  };

  const actas = Array.isArray(meetingsWithActs)
    ? meetingsWithActs
        .filter((m) => m?.data?.id && m.reunion?.id)
        .map((m) => ({
          ...m.data,
        meetingId: m.reunion.id,
      }))
    : [];

  console.log("📦 Actas renderizadas en tabla:", actas);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <div className="reuniones-container">
            <div className="reuniones-header">
              <h2 className="reuniones-title">Gestión de Actas</h2>
            </div>

            {mensaje && <div className="mensaje-exito">{mensaje}</div>}
            {error && <div className="mensaje-error">{error}</div>}

            <TablaActas
              actas={actas}
              onCrear={handleCrear}
              onEditar={handleEditar}
              onVer={handleVer}
              onFirmar={handleFirmar}
            />

            {showForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <form className="formulario-reunion" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="titulo"
                      placeholder="Título del acta"
                      value={form.titulo}
                      onChange={handleChange}
                      required
                    />
                    <textarea
                      name="contenido"
                      placeholder="Contenido del acta"
                      value={form.contenido}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                    <div className="botones-formulario">
                      <button className="meeting-button meeting-create-btn" type="submit">
                        {editing ? "Actualizar" : "Crear"}
                      </button>
                      <button className="meeting-button meeting-create-btn" type="button" onClick={resetForm}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showViewModal && actaSeleccionada && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>{actaSeleccionada.titulo}</h3>
                  <p>{actaSeleccionada.contenido}</p>
                  <button
                    className="meeting-button meeting-create-btn"
                    onClick={() => setShowViewModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActPage;
