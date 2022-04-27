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

export interface UpdateUserData {
  name: string;
  license: string;
  phone: string;
  address: string;
  province: string;
  cp: string;
  country: string;
  language: string;
  gender: number;
  birthday: string;
  handicap: number;
  time_playing: string;
  type: string;
}
