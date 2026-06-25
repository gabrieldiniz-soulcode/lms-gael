import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_RD_API_URL;
const key = process.env.NEXT_PUBLIC_RD_API_KEY;

export const apiRd = axios.create({ baseURL, timeout: 30000 });

apiRd.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params['api_key'] = key;
  return config;
}, (error) => {
  return Promise.reject(error);
});
