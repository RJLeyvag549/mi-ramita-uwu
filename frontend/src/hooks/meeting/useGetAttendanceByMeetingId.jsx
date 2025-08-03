import { useState, useCallback } from "react";
import api from "../../services/root.service";

const useGetAttendanceByMeetingId = () => {
  const [attendanceList, setAttendanceList] = useState([]);

  const fetchAttendance = useCallback(async (meetingId) => {
    try {
      const response = await api.get(`/meetings/${meetingId}/attendance`);
      console.log("Asistencia recibida:", response.data.data);
      setAttendanceList(response.data.data);
    } catch (error) {
      console.error("Error al obtener la asistencia:", error);
    }
  }, []);

  return { attendanceList, fetchAttendance };
};

export default useGetAttendanceByMeetingId;
