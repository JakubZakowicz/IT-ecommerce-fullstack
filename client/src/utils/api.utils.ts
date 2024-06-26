import axios, { AxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = {
  get: <T>(url: string, params?: object) =>
    axios.get<T>(baseURL + url, { ...params }),
  post: <T>(url: string, data: any, config?: AxiosRequestConfig) =>
    axios.post<T>(baseURL + url, data, config),
  put: <T>(url: string, data: any, config?: AxiosRequestConfig) =>
    axios.put<T>(baseURL + url, data, config),
  patch: <T>(url: string, data: any, config?: AxiosRequestConfig) =>
    axios.patch<T>(baseURL + url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axios.delete<T>(baseURL + url, config),
};
