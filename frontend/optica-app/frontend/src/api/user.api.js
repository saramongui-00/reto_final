import { userAPI } from "../utils/axios";

export const getUser = async (id) => {
  const res = await userAPI.get(`/usuarios/${id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await userAPI.get(`/usuarios`);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await userAPI.put(`/usuarios/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await userAPI.delete(`/usuarios/${id}`);
  return res.data;
};

export const updateUserStatus = async (id, estado) => {
  const res = await userAPI.patch(`/usuarios/${id}`, { estado });
  return res.data;
};