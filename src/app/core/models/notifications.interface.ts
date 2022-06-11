export interface Profile {
  id: number;
  user_id: number;
  username?: any;
  license: string;
  photo: string;
  created_at: Date;
  updated_at: Date;
  handicap: string;
  time_playing: number;
  type: number;
  gender: number;
  birthday: string;
  address: string;
  province?: any;
  phone?: any;
  cp?: any;
  country?: any;
  language?: any;
}

export interface UserSender {
  id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: Date;
  updated_at: Date;
  provider?: any;
  provider_id?: any;
  profile: Profile;
  to: any;
}

export interface NotificationData {
  type: string;
  detail: string;
  publication_id: string;
  user_sender: any;
  connection_id: number;
  user_id: string | number;
  // user_sender: UserSender;
}

export interface Data {
  data: NotificationData;
}

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: Data;
  read_at?: any;
  created_at: Date;
  updated_at: Date;
}
