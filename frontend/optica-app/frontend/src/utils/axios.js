// src/api/axiosConfig.js
import axios from "axios";

export const authAPI = axios.create({ baseURL: "http://localhost:8081" });
export const userAPI = axios.create({ baseURL: "http://localhost:8082" });
export const citasAPI = axios.create({ baseURL: "http://localhost:8083" }); 
export const patientAPI = axios.create({ baseURL: "http://localhost:8084" });

const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[userAPI, patientAPI, citasAPI].forEach(api => {
  api.interceptors.request.use(addToken);
});