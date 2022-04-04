export interface User {
  email: string;
  password: string;
}

export interface UserResponse {
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}
