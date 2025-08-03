import api from "../../services/root.service";
import useGetMeetings from "./useGetMeetings";

const useCreateMeeting = () => {
  const { fetchMeetings } = useGetMeetings();

  const createMeeting = async (form, isFormData = false) => {
    await api.post(
      "/meetings",
      form,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    );
    fetchMeetings();
  };

  return { createMeeting };
};

export default useCreateMeeting;
