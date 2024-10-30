import { User as SupabaseUser } from "@supabase/supabase-js";

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
          role: Role;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          password: string;
          createdAt?: string;
          role?: Role;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          createdAt?: string;
          role?: Role;
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

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type User =
  | SupabaseUser
  | {
      id: string;
      email?: string;
      user_metadata?: {
        name?: string;
      };
    };

export type PostImage = Tables<"PostImage">;

export type Article = {
  id: number;
  title: string;
  perex: string;
  author: {
    name: string;
    id: string;
  };
  comments: number;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  perex?: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
  comments: { count: number }[];
};

// Consistent naming and structure
export type PostPreview = Pick<
  Post,
  "id" | "title" | "content" | "imageUrl" | "createdAt"
> & {
  author: { name: string };
};

export type PostData = Pick<Post, "id" | "title" | "content"> & {
  author: { name: string };
  comments: { count: number };
};

export type SignInFormProps = {
  onSuccessfulLogin: () => void;
};

export type CommentInsert = Database["public"]["Tables"]["Comment"]["Insert"];

export type CommentFromDB = {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  authorId: string;
  User: {
    id: string;
    name: string;
  }; // Not an array, just a single object
};
export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: number;
  authorId: string;
  User: {
    id: string;
    name: string;
  };
};

export type CommentSectionProps = {
  postId: number;
};

export type AddCommentFormProps = {
  user: SupabaseUser | null;
  handleSubmitComment: (e: React.FormEvent) => Promise<void>;
  newComment: string;
  setNewComment: (comment: string) => void;
};

export type UserMetadata = {
  name?: string;
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
  comments: Comment[];
  images?: PostImage[];
};

export type CommentWithAuthor = Tables<"Comment"> & {
  author: Pick<Tables<"User">, "name" | "id">;
};
