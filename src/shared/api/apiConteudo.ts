import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_CONTEUDO_API_URL;

export const apiConteudo = axios.create({ baseURL, timeout: 1000000 });

apiConteudo.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (!!token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})
