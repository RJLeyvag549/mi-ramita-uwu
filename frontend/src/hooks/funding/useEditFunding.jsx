import api from "../../services/root.service.js";

export const useEditFunding = (fetchFundings) => {
  const editFunding = async (id, form) => {
    await api.put(`/funding/update/${id}`, form);
    fetchFundings();
  };
  return { editFunding };
};

export default useEditFunding;