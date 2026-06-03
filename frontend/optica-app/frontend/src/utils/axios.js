import axios from "axios";

export const authAPI = axios.create({
  baseURL: "http://localhost:8081", // ajusta si tu auth está en otro puerto
});

export const userAPI = axios.create({
  baseURL: "http://localhost:8082",
});

export const patientAPI = axios.create({
  baseURL: "http://localhost:8084",
});

// interceptor para token
const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[userAPI, patientAPI].forEach(api => {
  api.interceptors.request.use(addToken);
});