import { useState } from "react";
import api from "../../services/root.service.js";

export const useGetFundings = () => {
  const [fundings, setFundings] = useState([]);

  const fetchFundings = async () => {
    const res = await api.get("/funding/get");
    setFundings(res.data.data);
  };

  return { fundings, setFundings, fetchFundings };
};

export default useGetFundings;