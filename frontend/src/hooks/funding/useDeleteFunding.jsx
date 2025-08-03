import api from "../../services/root.service.js";

export const useDeleteFunding = (fetchFundings) => {
  const deleteFunding = async (id) => {
    await api.delete(`/funding/delete/${id}`);
    fetchFundings();
  };
  return { deleteFunding };
};

export default useDeleteFunding;