import api from "../../services/root.service.js";

export const useCreateFunding = (fetchFundings) => {
  const createFunding = async (form, isFormData = false) => {
    await api.post(
      "/funding/create",
      form,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );
    fetchFundings();
  };
  return { createFunding };
};

export default useCreateFunding;