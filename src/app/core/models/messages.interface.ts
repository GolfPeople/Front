

    export interface User {
        id: number;
        name: string;
        email: string;
        email_verified_at?: any;
        created_at: Date;
        updated_at: Date;
        provider?: any;
        provider_id?: any;
    }

    export interface Message {
        id: number;
        user_id: number;
        sale_id: number;
        message: string;
        created_at: Date;
        updated_at: Date;
        user: User;
    }

