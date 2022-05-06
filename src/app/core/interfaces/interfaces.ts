export interface Post {
  description: string;
  files: [];
  ubication: string;
}

export interface PostsResponse extends Post {
  id: number;
  user_id: number;
  hashtags: any;
}
