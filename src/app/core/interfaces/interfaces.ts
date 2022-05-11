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
