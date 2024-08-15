/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { login } from "../../service/auth/authService";
import store from "..";
import { setToken } from "../reducers/authReducer";

// React Query hook to handle login
export const useLogin = () => {
  return useMutation(login, {
    onSuccess: (data: { access_token: string; refresh_token: string }) => {
      console.log("Login successful:", data);
      store.dispatch(setToken(data));
    },
    onError: (error: {
      response: { data: { message: any } };
      message: any;
    }) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
