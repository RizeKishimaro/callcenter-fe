import axios from "axios";
import axiosInstance from "../../providers/axiosClient";

// Define the API endpoints
const PROFILE_URL = "/profile";

// Get the user profile (protected endpoint)
export const getProfile = async () => {
  const response = await axiosInstance.get(PROFILE_URL);
  return response.data;
};

// Login function to authenticate the user
export const login = async (credentials: {
  sipUsername: string;
  password: string;
  loginUrl: string;
}) => {
    const requestBody = credentials.loginUrl.includes("user/login")
      ? { email: credentials.sipUsername, password: credentials.password }
      : { sipName: credentials.sipUsername, password: credentials.password };

    const response = await axios.post(credentials.loginUrl, requestBody);

    return response.data;
};
