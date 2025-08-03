import { useState, useCallback } from "react";
import api from "../../services/root.service";

const useCreateAct = () => {
  const [loading, setLoading] = useState(false);

  const createActa = useCallback(async (meetingId, actaData) => {
    setLoading(true);
    try {
      const response = await api.post(`/meetings/${meetingId}/act`, actaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear acta:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createActa, loading };
};

export default useCreateAct;
