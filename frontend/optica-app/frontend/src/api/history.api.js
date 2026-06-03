import { patientAPI } from "../utils/axios";

export const getHistorialByPaciente = async (pacienteId) => {
  const res = await patientAPI.get(`/api/v1/historiales/paciente/${pacienteId}`);
  return res.data;
};

export const createHistorial = async (payload) => {
  const res = await patientAPI.post("/api/v1/historiales", payload);
  return res.data;
};