import { useState, useCallback } from "react";
import api from "../../services/root.service";

const useUpdateAct = () => {
  const [loading, setLoading] = useState(false);

  const updateActa = useCallback(async (meetingId, actaData) => {
    setLoading(true);
    try {
      const response = await api.put(`/meetings/${meetingId}/act`, actaData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar acta:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateActa, loading };
};

export default useUpdateAct;
