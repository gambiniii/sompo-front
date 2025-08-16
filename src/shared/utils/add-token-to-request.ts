import { AxiosInstance } from "axios";
import { store } from "../../store";

export const addTokenToRequest = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const authorization = state?.auth?.authorization || null;

    if (authorization) {
      config.headers.Authorization = `Bearer ${authorization.accessToken}`;
    }

    return config;
  });
};
