export type User = {
  name?: string;
  user_metadata?: {
    name?: string;
  };
  email?: string;
};

export type Article = {
  id: number;
  title: string;
  perex: string;
  author: string;
  comments: number;
};

export type MyArticleTableProps = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  perex?: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string;
  };
  comments: {
    count: number;
  }[];
};

export type ArticlePreview = Pick<Post, "id" | "title" | "perex" | "author"> & {
  comments: number;
};

export type PostPreview = Pick<
  Post,
  "id" | "title" | "content" | "imageUrl" | "createdAt"
> & {
  User: { name: string };
};

export type PostData = Pick<Post, "id" | "title" | "content" | "author"> & {
  Comment: { count: number }[];
};

export type SigninFormProps = {
  onSuccessfulLogin: () => void;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  authorId: string;
  User: {
    name: string;
    id: string;
  };
  voteCount: number;
};

export type CommentSectionProps = {
  postId: number;
};

export type VoteData = {
  commentId: number;
  _sum: {
    value: number;
  };
};

export type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};
