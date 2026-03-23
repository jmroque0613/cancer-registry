import axios from "axios";

export const fhirApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const djangoApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_URL,
});

// Add auth interceptor
[fhirApi, djangoApi].forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("kc_token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});
