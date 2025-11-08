// src/features/auth/types.ts
export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginPayload {
  sipName: string;
  password: string;
  campaignId: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}
