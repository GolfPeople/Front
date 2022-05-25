export interface Profile {
  id?: number;
  user_id?: number;
  username?: any;
  license?: any;
  photo?: string;
  created_at?: Date;
  updated_at?: Date;
  handicap?: string;
  time_playing?: any;
  type?: any;
  gender?: any;
  birthday?: any;
  address?: any;
  province?: any;
  phone?: any;
  cp?: any;
  country?: any;
  language?: any;
}

export interface Privacity {
  id: number;
  user_id: number;
  handicap: number;
  profile: number;
  created_at: Date;
  updated_at: Date;
}

export interface Friend {
  id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: Date;
  updated_at: Date;
  provider?: any;
  provider_id?: any;
  profile: Profile;
  privacity: Privacity;
  to?: any;
  from?: any;
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}

export interface FriendResponse {
  current_page: number;
  data: Friend[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}
