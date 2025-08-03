import api from "../../services/root.service";
import useGetMeetings from "./useGetMeetings";

const useDeleteMeeting = () => {
  const { fetchMeetings } = useGetMeetings();

  const deleteMeeting = async (id) => {
    await api.delete(`/meetings/${id}`);
    fetchMeetings();
  };

  return { deleteMeeting };
};

export default useDeleteMeeting;

