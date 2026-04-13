import { trackEvent, truncate } from "@/lib/trackingService";

import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_CONTEUDO_API_URL;

export const apiConteudo = axios.create({ baseURL, timeout: 1000000 });

apiConteudo.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (!!token) config.headers.Authorization = `Bearer ${token}`;

  const safeHeaders = { ...(config.headers as Record<string, unknown>) };
  delete safeHeaders["Authorization"];
  delete safeHeaders["authorization"];
  void trackEvent({
    type: "api_request",
    timestamp: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : "",
    data: {
      url: config.url ?? null,
      method: config.method ?? null,
      params: config.params ? truncate(config.params) : null,
      body: config.data ? truncate(config.data) : null,
      headers: truncate(safeHeaders),
    },
  });

  return config;
});

apiConteudo.interceptors.response.use(
  (response) => {
    void trackEvent({
      type: "api_response",
      timestamp: new Date().toISOString(),
      page: typeof window !== "undefined" ? window.location.pathname : "",
      data: {
        url: response.config.url ?? null,
        method: response.config.method ?? null,
        status: response.status,
        responseData: truncate(response.data),
      },
    });
    return response;
  },
  (error) => Promise.reject(error)
);
