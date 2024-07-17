export interface Thumbnails {
  avatar: string;
  avatar_2x: string;
  avatar_webp: string;
  avatar_webp_2x: string;
}

export interface Issue {
  key: string;
  date_created: string;
  status: string;
}

export interface Designer {
  avatar: string;
  username: string;
  email: string;
  thumbnails: Thumbnails;
  issues: Issue[];
}

export interface DesignerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Designer[];
}
