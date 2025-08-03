import { useState, useCallback } from "react";
import api from "../../services/root.service";

const useSignAct = () => {
  const [loading, setLoading] = useState(false);

  const signActa = useCallback(async (meetingId) => {
    setLoading(true);
    try {
      const response = await api.patch(`/meetings/${meetingId}/acta`);
      return response.data;
    } catch (error) {
      console.error("Error al firmar acta:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signActa, loading };
};

export default useSignAct;
