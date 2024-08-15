import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum Role {
  "admin",
  "supervisor",
  "agent",
}
interface AuthStateProps {
  sipUsername: string;
  password: string;
  role: Role | "";
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
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{ access_token: string; refresh_token: string }>) => {
          state.access_token = action.payload.access_token;
          state.refresh_token = action.payload.refresh_token;
          localStorage.setItem("access_token", action.payload.access_token);
          localStorage.setItem("refresh_token", action.payload.refresh_token);
        },
        logout: (state) => {
          state.sipUsername = "";
          state.password = "";
          state.role = "";
          state.access_token = "";
          state.refresh_token = "";
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        },
      },
    });
    
    export const { setToken, logout } = authSlice.actions;
    export default authSlice.reducer;