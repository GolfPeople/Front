import { PostComponent } from 'src/app/shared/components/post/post.component';

export interface Post {
  description: string;
  files: [];
  ubication: string;
}

export interface PostsResponse extends Post {
  id: number;
  user_id: number;
  hashtags: any;
  likes: Like[];
  user: UserPublicData;
}
export interface Like {
  id: number;
  publication_id: number;
  user: User;
  user_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export interface PostToEdit extends Omit<Post, 'files'> {}

export interface UserPublicData {
  email: string;
  id: number;
  name: string;
  profile: UserProfileData;
}

export interface UserProfileData {
  address?: string;
  birthday?: string;
  country?: string;
  cp?: number;
  created_at?: string;
  gender?: number;
  handicap?: string;
  id?: number;
  language?: string;
  license?: string;
  phone?: number;
  photo?: string;
  province?: string;
  time_playing?: number;
  type?: number;
  updated_at?: string;
  user_id?: number;
  username?: string;
}
