import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Role enum
enum Role {
  admin = "admin",
  supervisor = "supervisor",
  agent = "agent",
}
interface AuthStateProps {
  sipUsername: string;
  password: string;
  // role: Role | ""; // Role can be one of the enum values or an empty string
  role: string;
  access_token: string;
  refresh_token: string;
}

const initialState: AuthStateProps = {
  sipUsername: "",
  password: "",
  role: "",
  access_token: "",
  refresh_token: "",
};

const authSlice = createSlice({

  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
        role: string;
      }>
    ) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.role = action.payload.role;
      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
      localStorage.setItem("role", state.role);
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        sipUsername: string;
        password: string;
      }>
    ) => {
      state.sipUsername = action.payload.sipUsername;
      state.password = action.payload.password;

      localStorage.setItem("sipUsername", state.sipUsername);
      localStorage.setItem("password", state.password);
    },
    logout: (state) => {
      state.sipUsername = "";
      state.password = "";
      state.role = "";
      state.access_token = "";
      state.refresh_token = "";
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("sipUsername");
      localStorage.removeItem("password");
      localStorage.removeItem("role");
    },
  },
});


export const { setToken, setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;
