export type Author = {
  name: string;
  role: string;
  avatar_url: string;
};

export type Blog = {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  author: Author;
  createdAt: string;
  is_approved: boolean;
  updatedAt: string;
  tags: string[];
  publishDate: string;
};
