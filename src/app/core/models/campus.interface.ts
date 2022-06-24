export interface Campus {
  id: number;
  information: string;
  services: string;
  designer: string;
  day: string;
  hour: string;
  created_at?: Date;
  updated_at?: Date;
  location: string;
  photo?: string;
  lat?: any;
  long?: any;
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}

export interface CampusResponse {
  current_page: number;
  data: Campus[];
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
