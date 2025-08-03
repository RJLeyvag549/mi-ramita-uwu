import api from "../../services/root.service.js";

export const useDownloadFundings = () => {
  const downloadFundings = async () => {
    const response = await api.get(`/funding/planilla`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `acreditaciones_fondos.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  return { downloadFundings };
};

export default useDownloadFundings;