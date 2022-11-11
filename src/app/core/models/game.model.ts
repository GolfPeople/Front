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
    hour: string;
    reservation: any[]
    currentUserPlaying: boolean;
    guests: any[]
  }

  export class Tournament{
  id: number;
  photo: string;
  name: string;
  courses: any;
  owner_name: string;
  date: string;
  course: any;
  price: any;
  link: string; 
  services: any;
  image: string;
  address: string;
  lat: string;
  long: string;
  description: string;
}  