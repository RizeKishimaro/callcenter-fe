import axiosInstance from "../../providers/axiosClient";

// Define the API endpoints
const PROFILE_URL = "/auth/profile";
const LOGIN_URL = `${import.meta.env.VITE_APP_BACKEND_URL}agent/login`;

// Get the user profile (protected endpoint)
export const getProfile = async () => {
  const response = await axiosInstance.get(PROFILE_URL);
  return response.data;
};

// Login function to authenticate the user

export const login = async (credentials: { sipUsername: string; password: string }) => {
  try {
    const response = await axiosInstance.post(LOGIN_URL, {
      sipName: credentials.sipUsername,
      password: credentials.password,
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // You might want to handle this error further in your UI
  }
};
