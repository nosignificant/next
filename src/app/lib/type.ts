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
    border?: boolean;
    notfirst?: boolean;
  } | null;
};

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  keyboard?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  type?: string;
  title?: string;
};

export type LinkNode = {
  type: "link";
  href: string;
  children: FormattedText[];
};

export type TextNode = FormattedText | LinkNode;

export type ParagraphNode = {
  type: "paragraph";
  children: TextNode[];
};

export type GNode = {
  id: string;
  slug: string;
  label: string;
  type: "tag" | "post";
  thumbnail?: string;
  parent?: string;
};

export type GLink = { source: string; target: string };

export type GData = { nodes: GNode[]; links: GLink[] };
