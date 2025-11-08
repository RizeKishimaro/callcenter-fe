import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import setupReducer from "./reducers/setupReducer";
import { AuthStateProps } from "./reducers/authReducer"; // Import your type if needed

// Retrieve and decrypt values from localStorage
const sipUsername = localStorage.getItem("sipUsername") || "";
const password = localStorage.getItem("password") || "";
const access_token = localStorage.getItem("access_token") || "";
const refresh_token = localStorage.getItem("refresh_token") || "";
const role = localStorage.getItem("role") || "";

// Explicitly define initialState with correct type
const initialState: { auth: AuthStateProps } = {
  auth: {
    sipUsername,
    password,
    role, // Default value for role
    access_token,
    refresh_token,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    setup: setupReducer,
  },
  preloadedState: initialState,
});

export default store;
