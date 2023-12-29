import { HttpError } from "@refinedev/core";
import axios, { AxiosRequestHeaders } from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

axiosInstance.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("refine-auth")}`,
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("refine-auth");

  if (config.headers) {
    // Set the Authorization header if it exists
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Create the headers property if it does not exist
    config.headers = {
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }

  return config;
});

export { axiosInstance };
