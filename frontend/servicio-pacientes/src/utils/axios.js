import axios from "axios";

export const patientAPI = axios.create({
  baseURL: "http://localhost:8084",
});

const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

patientAPI.interceptors.request.use(addToken);

patientAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);