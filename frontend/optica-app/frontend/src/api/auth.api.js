import { authAPI } from "../utils/axios";

export const loginRequest = async (data) => {
  const res = await authAPI.post("/auth/login", data);
  return res.data;
};