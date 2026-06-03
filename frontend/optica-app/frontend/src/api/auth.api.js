import { authAPI } from "../utils/axios";

export const loginRequest = async (data) => {
  const res = await authAPI.post("api/auth/login", data);
  return res.data;
};