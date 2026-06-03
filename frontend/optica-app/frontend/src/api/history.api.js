import axios from "axios";

const base = import.meta?.env?.VITE_HISTORIAL_BASE_URL || "/api/v1/historiales";

const historyAPI = axios.create({
  baseURL: base,
});

historyAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getHistorialByPaciente = async (pacienteId) => {
  try {
    const res = await historyAPI.get(`/paciente/${pacienteId}`);
    return res.data;
  } catch (err) {
    console.error("Error en getHistorialByPaciente:", err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};

export const createHistorial = async (payload) => {
  try {
    const res = await historyAPI.post("", payload);
    return res.data;
  } catch (err) {
    console.error("Error en createHistorial:", err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};