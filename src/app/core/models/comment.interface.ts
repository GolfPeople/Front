import {
  UserProfileData,
  User,
  UserPublicData,
} from '../interfaces/interfaces';

export interface CommentResponse {
  likes: any;
  comments: Comment[];
}

export interface Comment {
  id: number;
  publication_id: number;
  user_id: number;
  description: string;
  created_at: string;
  user: UserPublicData;
}
