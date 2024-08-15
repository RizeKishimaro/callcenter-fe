import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "../config/config";
import { store } from "../store";
// import { refreshUserToken } from "../store/reducers/authSlice";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL
})

const state = store.getState();
const token = state.auth.access_token;


axiosInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {

        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (resposne: AxiosResponse) => resposne,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // await store.dispatch(refreshUserToken())

            if (token && originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;