export type Post = {
  excerpt?: string;
  slug: string;
  publishedAt: string;
  content: string;
  tags: string[];
  chron: {
    year?: string;
    month?: string;
    day?: string;
  } | null;
};
