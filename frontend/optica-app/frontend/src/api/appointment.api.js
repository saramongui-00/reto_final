import { patientAPI } from "../utils/axios";

export const getCitas = async () => {
  const res = await patientAPI.get("/api/v1/citas");
  return res.data;
};