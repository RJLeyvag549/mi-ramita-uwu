import api from "../../services/root.service";

const useToggleAttendance = () => {
  const toggleAttendance = async (meetingId, userId, nuevaFirma) => {
    try {
      const response = await api.put(
        `/meetings/${meetingId}/attendance/${userId}`,
        { firma: nuevaFirma }
      );
      console.log("Asistencia actualizada:", response);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
      throw error;
    }
  };

  return { toggleAttendance };
};


export default useToggleAttendance;
