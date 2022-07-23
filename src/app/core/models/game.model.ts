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