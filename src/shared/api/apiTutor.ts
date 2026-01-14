import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_TUTOR1_API_URL;

export const apiTutor = axios.create({ baseURL, timeout: 10000 });

apiTutor.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (!!token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})
