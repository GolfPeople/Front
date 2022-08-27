export interface Game {
    name: string;
    date: string;
    address: string;
    lat: number;
    long: number;
    users: any[];
    total: number;
    extra: any[];
    hours:any[];
    campus: any;  
    skipExtra: boolean;
  }

export interface Tournament{
  photo: string;
  name: string;
  owner_name: string;
  date: string;
  course: any;
  price: number;
  link: string;
  services: any;
  description: string;
}  