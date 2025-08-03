import api from "../../services/root.service";
import useGetMeetings from "./useGetMeetings";

const useUpdateMeeting = () => {
  const { fetchMeetings } = useGetMeetings();

  const updateMeeting = async (id, form, isFormData = false) => {
    await api.put(
      `/meetings/${id}`,
      form,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    );
    fetchMeetings();
  };

  return { updateMeeting };
};

export default useUpdateMeeting;

