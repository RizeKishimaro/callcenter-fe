import axios from "axios";
import { BACKEND_URL } from "../config/config";
import store from "../store";
import { logout, setToken } from "../store/reducers/authReducer";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.access_token;

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      console.log("Second try : ");

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Call refresh token logic here
          const response = await axios.post(`${BACKEND_URL}/auth/refresh`, { token: refreshToken });
          const newTokens = response.data;

          // Update Redux state with new tokens
          store.dispatch(setToken(newTokens));

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newTokens.access_token}`;
          return axiosInstance(originalRequest);
        } else {
          store.dispatch(logout());
          return Promise.reject(error);
        }


      } catch (err) {
        console.log(err)
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
