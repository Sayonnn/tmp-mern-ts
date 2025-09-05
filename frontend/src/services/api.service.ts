import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/** 
 * Axios instance with global configuration
 * - baseURL
 * - JSON headers
 * - withCredentials to send cookies
 * - timeout
 */
const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies automatically
  timeout: 15000,        // optional: 15 seconds
});

/**
 * Request interceptor
 * Adds Authorization header automatically if token exists
 */
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor
 * Can handle global errors here if needed
 */
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/** CRUD functions */

/** Fetch a single resource */
export const fetchData = async (endpoint: string, params = {}) => {
  const response = await apiService.get(endpoint, { params });
  return response.data;
};

/** Fetch multiple resources */
export const fetchDatas = async (endpoint: string, params = {}) => {
  const response = await apiService.get(endpoint, { params });
  return response.data;
};

/** Create a single resource */
export const createData = async (endpoint: string, data: any) => {
  const response = await apiService.post(endpoint, data);
  return response.data;
};

/** Create multiple resources (bulk) */
export const createDatas = async (endpoint: string, dataArray: any[]) => {
  const response = await apiService.post(endpoint, dataArray);
  return response.data;
};

/** Update a single resource */
export const updateDatas = async (endpoint: string, data: any) => {
  const response = await apiService.put(endpoint, data);
  return response.data;
};

/** Delete a resource */
export const deleteDatas = async (endpoint: string) => {
  const response = await apiService.delete(endpoint);
  return response.data;
};

/** -----------------------------
 * File / Image Handling
 * ----------------------------- */

/** Upload a file (image, pdf, etc.) */
export const uploadFile = async (endpoint: string, file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiService.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/** Download a file (returns a blob URL) */
export const downloadFile = async (endpoint: string) => {
  const response = await apiService.get(endpoint, { responseType: "blob" });
  const blob = response.data;
  const url = URL.createObjectURL(blob);
  return url;
};

export default apiService;
export { API_URL };
