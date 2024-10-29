export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          createdAt: string;
          role: "USER" | "ADMIN";
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          password: string;
          createdAt?: string;
          role?: "USER" | "ADMIN";
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          createdAt?: string;
          role?: "USER" | "ADMIN";
        };
      };
      Post: {
        Row: {
          id: number;
          title: string;
          content: string;
          imageUrl: string | null;
          createdAt: string;
          updatedAt: string;
          authorId: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          imageUrl?: string | null;
          createdAt?: string;
          updatedAt?: string;
          authorId: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          imageUrl?: string | null;
          createdAt?: string;
          updatedAt?: string;
          authorId?: string;
        };
      };
      Comment: {
        Row: {
          id: number;
          content: string;
          postId: number;
          authorId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: number;
          content: string;
          postId: number;
          authorId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: number;
          content?: string;
          postId?: number;
          authorId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      PostImage: {
        Row: {
          id: number;
          url: string;
          fileName: string;
          altText: string | null;
          createdAt: string;
          updatedAt: string;
          postId: number;
        };
        Insert: {
          id?: number;
          url: string;
          fileName: string;
          altText?: string | null;
          createdAt?: string;
          updatedAt?: string;
          postId: number;
        };
        Update: {
          id?: number;
          url?: string;
          fileName?: string;
          altText?: string | null;
          createdAt?: string;
          updatedAt?: string;
          postId?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type User = Pick<Tables<"User">, "name"> & {
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

export type SortableColumnProps = {
  label: string;
  sortKey: keyof Article;
  sortConfig: {
    key: keyof Article;
    direction: "ascending" | "descending";
  } | null;
  onSort: (key: keyof Article) => void;
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
};

export type CommentSectionProps = {
  postId: number;
};

export type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export type ArticleFormProps = {
  initialTitle: string;
  initialContent: string;
  initialImageUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
};

export type FormErrors = {
  title?: string;
  content?: string;
};

export type PostWithAuthor = Tables<"Post"> & {
  author: Tables<"User">;
  comments: { count: number }[];
};

export type CommentWithAuthor = Tables<"Comment"> & {
  User: Pick<Tables<"User">, "name" | "id">;
};
