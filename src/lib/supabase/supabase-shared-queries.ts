import type { SupabaseClient as BaseSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/supabase";

export type SupabaseClient = BaseSupabaseClient<Database>;

export type PostWithAuthorAndComments = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string;
  };
  comments: {
    id: number;
  }[];
};

export const queries = {
  getFullPost: async (supabase: SupabaseClient, postId: string) => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `
        id,
        title,
        content,
        imageUrl,
        createdAt,
        author:User (name),
        comments:Comment(id)
      `
      )
      .eq("id", Number(postId))
      .single();

    return {
      data: data as PostWithAuthorAndComments | null,
      error,
    };
  },

  getUserPosts: async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `
        id,
        title,
        content,
        author:User(name),
        comments:Comment(count)
      `
      )
      .eq("authorId", userId);

    return {
      data: data as PostWithAuthorAndComments[] | null,
      error,
    };
  },

  getPostById: async (supabase: SupabaseClient, postId: number) => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `
        id,
        title,
        content,
        imageUrl,
        createdAt,
        author:User(name),
        comments:Comment(count)
      `
      )
      .eq("id", postId)
      .single();

    return {
      data: data as PostWithAuthorAndComments | null,
      error,
    };
  },

  getRecentPosts: async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `
        id,
        title,
        content,
        imageUrl,
        createdAt,
        author:User (name),
        comments:Comment(id)
      `
      )
      .order("createdAt", { ascending: false })
      .limit(10);

    return {
      data: data as PostWithAuthorAndComments[] | null,
      error,
    };
  },
};
