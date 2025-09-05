export type Post = {
  excerpt?: string;
  thumbnail?: string;
  slug: string;
  parent: string;
  publishedAt: string;
  content: string;
  tags: string[];
  chron: {
    year?: string;
    month?: string;
    day?: string;
  } | null;
};
