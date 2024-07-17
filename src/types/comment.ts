export interface CommentResponse {
  id: number;
  issue: string;
  designer: Designer;
  date_created: string;
  message: string;
}

export interface Designer {
  avatar: string;
  username: string;
  thumbnails: Thumbnails;
}

export interface Thumbnails {
  avatar: string;
  avatar_2x: string;
  avatar_webp: string;
  avatar_webp_2x: string;
}
