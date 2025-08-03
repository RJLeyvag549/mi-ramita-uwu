import { useState, useCallback } from "react";
import api from "../../services/root.service";

const useGetMeetings = () => {
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await api.get("/meetings");
      console.log("Respuesta completa:", response);
      setMeetings(response.data.data);
    } catch (error) {
      console.error("Error al obtener reuniones:", error);
    }
  }, []);

  return { meetings, fetchMeetings };
};

export default useGetMeetings;
