import axiosInstance from "../../providers/axiosClient";

// Define the API endpoints
const PROFILE_URL = "/auth/profile";
const LOGIN_URL = "/agent/login";

// Get the user profile (protected endpoint)
export const getProfile = async () => {
  const response = await axiosInstance.get(PROFILE_URL);
  return response.data;
};

// Login function to authenticate the user
export const login = async (credentials: {
  sipUsername: string;
  password: string;
}) => {
  const response = await axiosInstance.post(LOGIN_URL, credentials);
  localStorage.setItem("sipUsername", credentials.sipUsername);
  localStorage.setItem("password", credentials.password);
  return response.data;
};
