import axios from "axios";

/**
 * Merkezi axios instance.
 * Faz 2'de baseURL, interceptors ve auth token yönetimi eklenecek.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Faz 2'de eklenecek request interceptor:
 * - Authorization header (JWT token)
 */
// apiClient.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

/**
 * Faz 2'de eklenecek response interceptor:
 * - 401 → logout & redirect
 * - Global error handling
 */
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout();
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   }
// );
