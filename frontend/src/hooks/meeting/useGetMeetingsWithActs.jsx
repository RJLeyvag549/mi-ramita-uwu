import { useState, useCallback } from "react";
import api from "../../services/root.service";
console.log("📥 Hook useGetMeetingsWithActs inicializado");

const useGetMeetingsWithActs = () => {
  const [meetingsWithActs, setMeetingsWithActs] = useState([]);

  const fetchMeetingsWithActs = useCallback(async () => {
    console.log("🌀 [Hook] Iniciando fetch de reuniones...");
    try {
      const meetingsRes = await api.get("/meetings");
      console.log("✅ [Hook] Respuesta reuniones:", meetingsRes);

      const meetings = meetingsRes.data?.data;
      if (!meetings || meetings.length === 0) {
        console.warn("⚠️ [Hook] No se recibieron reuniones válidas:", meetings);
        setMeetingsWithActs([]);
        return;
      }

      const meetingsData = await Promise.all(
        meetings.map(async (meeting) => {
          try {
            const actRes = await api.get(`/meetings/${meeting.id}/act`);
            console.log(`📄 [Hook] Acta de reunión ${meeting.id}:`, actRes.data);
            return { ...actRes.data, reunion: meeting }; // ahora retornamos solo datos del acta, pero con reunión adjunta
          } catch (error) {
            if (error.response?.status === 404) {
                console.log(`ℹ️ [Hook] Reunión ${meeting.id} no tiene acta.`);
            } else {
              console.error(`❌ [Hook] Error acta reunión ${meeting.id}:`, error);
            }
            return null; // no hay acta
          }
        })
      );

      const filtered = meetingsData.filter((m) => m !== null); // solo actas existentes
      console.log("🧩 [Hook] Actas existentes:", filtered);
      setMeetingsWithActs(filtered);
    } catch (error) {
      console.error("❌ [Hook] Error al obtener reuniones:", error);
    }
  }, []);


  return { meetingsWithActs, fetchMeetingsWithActs };
};

export default useGetMeetingsWithActs;
