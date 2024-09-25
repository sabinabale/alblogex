"use client";

import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { name: string };
  upvotes: number;
  downvotes: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  User: { name: string };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchPostAndComments = useCallback(async () => {
    const { data: postData, error: postError } = await supabase
      .from("Post")
      .select(`*, User (name)`)
      .eq("id", params.id)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
      router.push("/404");
      return;
    }

    setPost(postData);

    const { data: commentsData, error: commentsError } = await supabase
      .from("Comment")
      .select(`*, author:User (name)`)
      .eq("postId", params.id)
      .order("createdAt", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
    } else {
      setComments(commentsData || []);
    }
  }, [params.id, supabase, router]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    const { data, error } = await supabase
      .from("Comment")
      .insert({
        content: newComment,
        postId: params.id,
        authorId: user.id,
      })
      .select(`*, author:User (name)`)
      .single();

    if (error) {
      console.error("Error submitting comment:", error);
    } else if (data) {
      setComments([data, ...comments]);
      setNewComment("");
    }
  }

  async function handleVote(
    commentId: number,
    voteType: "upvote" | "downvote"
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }

    const { error } = await supabase
      .from("CommentVote")
      .upsert(
        {
          userId: user.id,
          commentId: commentId,
          voteType: voteType,
        },
        { onConflict: "userId, commentId" }
      )
      .select();

    if (error) {
      console.error("Error voting:", error);
    } else {
      // Refresh comments to reflect new vote count
      fetchPostAndComments();
    }
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-sm">
        By {post.User.name} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg mb-8 object-cover"
        />
      )}
      <div className="prose max-w-none mb-8">{post.content}</div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Comments ({comments.length})
        </h2>
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Comment
          </button>
        </form>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4 p-4 border rounded">
            <p>{comment.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              By {comment.author.name} ·{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => handleVote(comment.id, "upvote")}
                className="text-green-500 hover:text-green-700"
              >
                ▲ {comment.upvotes}
              </button>
              <button
                onClick={() => handleVote(comment.id, "downvote")}
                className="text-red-500 hover:text-red-700"
              >
                ▼ {comment.downvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
