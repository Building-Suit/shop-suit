export interface SignupPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface GoogleOAuthPayload {
  redirectTo?: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
  };
  profile: {
    id: string;
    portal_id: string;
    displayName: string;
  };
}
