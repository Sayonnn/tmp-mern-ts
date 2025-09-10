import axios from "axios";
import type { apiArgumentProps, fileArgumentProps } from "../interfaces/apiInterface";
import { runCatchErrorLogger, runTryErrorLogger, throwCatchError, throwTryError } from "../utils/response.handler";

export const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create axios instance
 * @param {Object} baseURL, headers, method, withCredentials, timeout
 * @returns axios instance
 */
const apiService = axios.create({
  baseURL: API_URL,
  headers:{
    'content-type':'application/json',
  },
  withCredentials:true,
  timeout:15000,
})

/**
 * Interceptors for request
 * @param {Object} config
 * @returns config or throws error
 */
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if(token){
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
})

/**
 * Interceptors for response
 * @param {Object} response
 * @returns response or throws error
 */
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint (refresh token stored in HttpOnly cookie)
        const { data } = await apiService.post("/auth/refresh-access-token");
        // Save new token
        localStorage.setItem("authToken", data.accessToken);

        // Update headers and retry the original request
        apiService.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiService(originalRequest);
      } catch (error) {
        runCatchErrorLogger(error);
        throwCatchError(error);

        // Clear token and redirect to login (optional)
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Fetch a single resource
 * @param {Object} url, data, params
 * @returns single resource data or throws error
 */
export const fetchData = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.get(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    return data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Fetch multiple resources
 * @param {Object} url, params
 * @returns multiple resources data or throws error
 */
export const fetchDatas = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.get(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Create a single resource
 * @param {Object} url, data
 * @returns created resource data or throws error
 * Also used for login and registration 
 */
export const postDatas = async ({ url, data = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.post(url, data);

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Update a single resource
 * @param {Object} url, data, params
 * @returns updated resource data or throws error
 */
export const putDatas = async ({ url, data = {}, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.put(url, data, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};
  
/**
 * Delete a single resource
 * @param {Object} url, params
 * @returns deleted resource data or throws error
 */
export const deleteDatas = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.delete(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/* ==============================================================
 * Upload Assets
 * ============================================================= */

/**
 * Upload a single asset
 * @param {Object} url, data
 * @returns uploaded asset data or throws error
 */
export const uploadAsset = async ({url, file,onProgress}: fileArgumentProps) => {
  if(!file){
    throw new Error("No file provided");
  }

  try {
   const formData = new FormData();
   formData.append("file", file);

   const response = await apiService.post(url, formData, {
    headers:{
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    onUploadProgress:(progressEvent) => {
      if(onProgress && progressEvent.total){
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(progress);
      }
    }
   });

   if (!response || !response.data) {
    throwTryError(response);
    runTryErrorLogger(response);
   }

   return response.data;

  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Upload multiple assets with progress
 * @param {Object} url, files, onProgress
 * @returns uploaded assets data or throws error
 */
export const uploadAssets = async ({url,files,onProgress}: fileArgumentProps) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await apiService.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Download Assets
 * @param {Object} url - endpoint to fetch asset from
 * @param {Object} params - optional query parameters
 * @returns {Blob} downloaded asset data
 */
export const downloadAsset = async ({ url, params = {},filename = "file" }: fileArgumentProps) => {
  if(!filename){
    throw new Error("No filename provided");
  }

  try {
    const response = await apiService.get(url, { 
      params,
      responseType: 'blob',
    });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(response.data);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};
