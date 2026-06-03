import axios from "axios";

const base = import.meta?.env?.VITE_CITAS_BASE_URL || "http://localhost:8083/api/v1/citas";

const citasAPI = axios.create({
  baseURL: base,
});

citasAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createCita = async (payload) => {
  try {
    const res = await citasAPI.post("", payload); 
    return res.data;
  } catch (err) {
    const serverMessage = err?.response?.data?.message || err?.response?.data || null;
    const message = serverMessage ? String(serverMessage) : err.message || 'Error de red';
    const enhanced = new Error(message);
    enhanced.original = err;
    throw enhanced;
  }
};

export const cancelCita = async (id) => {
  try {
    const res = await citasAPI.patch(`/${id}/cancelar`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCitasByPatient = async (patientId) => {
  try {
    const res = await citasAPI.get(`/paciente/${encodeURIComponent(patientId)}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const searchCitasByRange = async (inicio, fin) => {
  try {
    const res = await citasAPI.get(`/buscar`, {
      params: { inicio, fin },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCitasEnEspera = async () => {
  try {
    const res = await citasAPI.get("/lista-atencion");
    return res.data;
  } catch (err) {
    console.error("Error en la petición de citas en espera:", err);
    throw err;
  }
};

export const prepararCita = async (id) => {
  try {
    const response = await axios.patch(`http://localhost:8083/api/v1/citas/${id}/preparar`);
    return response.data;
  } catch (error) {
    console.error("Error al preparar cita:", error);
    throw error;
  }
};

export default citasAPI;