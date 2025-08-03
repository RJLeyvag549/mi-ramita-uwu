import { useEffect, useState } from "react";
import useGetFundings from '../hooks/funding/useGetFundings.jsx';
import useCreateFunding from '../hooks/funding/useCreateFunding.jsx';
import useEditFunding from '../hooks/funding/useEditFunding.jsx';
import useDeleteFunding from '../hooks/funding/useDeleteFunding.jsx';
import useDownloadFundings from '../hooks/funding/useDownloadFundings.jsx';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/funding.css";

function FundingPage() {
  const { fundings, fetchFundings } = useGetFundings();
  const { createFunding } = useCreateFunding(fetchFundings);
  const { editFunding } = useEditFunding(fetchFundings);
  const { deleteFunding } = useDeleteFunding(fetchFundings);
  const { downloadFundings } = useDownloadFundings();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
    status: "",
    comprobante: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFundings();
  }, [fetchFundings]);

  const handleChange = e => {
    if (e.target.name === "comprobante") {
      setForm({ ...form, comprobante: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("amount", form.amount);
      formData.append("date", form.date);
      formData.append("status", form.status);
      if (form.comprobante) {
        formData.append("comprobante", form.comprobante);
      }

      if (editingId) {
        await editFunding(editingId, formData, true);
        setMessage("Acreditación actualizada exitosamente");
        setEditingId(null);
      } else {
        await createFunding(formData, true);
        setMessage("Acreditación creada exitosamente");
      }
      setForm({ name: "", amount: "", date: "", status: "", comprobante: "" });
      await fetchFundings();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al procesar la solicitud");
      }
    }
  };

  const handleEdit = funding => {
    setForm({
      name: funding.name,
      amount: funding.amount,
      date: funding.date,
      status: funding.status,
      comprobante: "" // No se puede editar el archivo directamente
    });
    setEditingId(funding.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async id => {
    setMessage("");
    setError("");
    try {
      await deleteFunding(id);
      setMessage("Acreditación eliminada exitosamente");
      await fetchFundings();
    } catch (err) {
      setError("Error al eliminar la acreditación");
    }
  };

  const handleDownload = async () => {
    await downloadFundings();
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <div className="funding-container">
            <h2 className="funding-title">{editingId ? "Editar Acreditación" : "Crear Acreditación"}</h2>
            {message && <div className="funding-message">{message}</div>}
            {error && <div className="funding-error">{error}</div>}
            <form className="funding-form" onSubmit={handleSubmit} encType="multipart/form-data">
              <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
              <input name="amount" placeholder="Monto" value={form.amount} onChange={handleChange} required type="number" />
              <input
                name="date"
                placeholder="Fecha"
                value={form.date}
                onChange={handleChange}
                required
                type="date"
                className="custom-date-input"
              />
              <select name="status" value={form.status} onChange={handleChange} required>
                <option value="">Seleccione estado</option>
                <option value="acreditado">Acreditado</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazado">Rechazado</option>
              </select>
              {/* Custom file input */}
              <label className="custom-file-label">
                Subir comprobante
                <input
                  name="comprobante"
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </label>
              <span className="file-name">
                {form.comprobante ? form.comprobante.name : "Ningún archivo seleccionado"}
              </span>
              <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", amount: "", date: "", status: "", comprobante: "" }); }}>
                  Cancelar
                </button>
              )}
            </form>

            <h2 className="funding-title">Acreditaciones Creadas</h2>
            <button className="funding-download-btn" onClick={handleDownload}>Descargar Todas</button>
            <div className="funding-table-container">
              <table className="funding-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Comprobante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fundings.map(funding => (
                    <tr key={funding.id}>
                      <td>{funding.name}</td>
                      <td>{funding.amount}</td>
                      <td>{funding.date}</td>
                      <td>
                        <span className={
                          funding.status === "pendiente" ? "status status-pendiente" :
                            funding.status === "acreditado" ? "status status-acreditado" :
                              funding.status === "rechazado" ? "status status-rechazado" : ""
                        }>
                          {funding.status}
                        </span>
                      </td>
                      <td>
                        {funding.comprobante ? (
                          <a
                            href={`http://localhost:3000/${funding.comprobante}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            comprobante
                          </a>
                        ) : (
                          "Sin comprobante"
                        )}
                      </td>
                      <td className="actions">
                        <button className="edit" onClick={() => handleEdit(funding)}>Editar</button>
                        <button className="delete" onClick={() => handleDelete(funding.id)}>Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundingPage;