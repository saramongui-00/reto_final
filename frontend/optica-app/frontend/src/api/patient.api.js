import { patientAPI } from "../utils/axios";

export const getPatient = async (documento) => {
  const res = await patientAPI.get(`/pacientes/documento/${documento}`);
  return res.data;
};

export const getAllPatients = async (page = 1, limit = 10) => {
  const res = await patientAPI.get(`/pacientes?page=${page}&limit=${limit}`);
  return res.data;
};

export const createPatient = async (data) => {
  const res = await patientAPI.post("/pacientes", data);
  return res.data;
};

export const updatePatient = async (id, data) => {
  const res = await patientAPI.put(`/pacientes/${id}`, data);
  return res.data;
};

export const deletePatient = async (id) => {
  const res = await patientAPI.delete(`/pacientes/${id}`);
  return res.data;
};

export const getSexos = async () => {
  const res = await patientAPI.get("/pacientes/enums/sexo");
  return res.data;
};

export const getEstadosCiviles = async () => {
  const res = await patientAPI.get("/pacientes/enums/estado-civil");
  return res.data;
};

export const getPatientById = async (documento) => {
  const res = await patientAPI.get(`/pacientes/documento/${documento}`); // <-- Añadimos /documento/
  return res.data;
};