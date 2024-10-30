import React, { useState } from "react";
import { CommentSectionProps } from "@/types/supabase";
import { useComments } from "@/lib/hooks/useComments";
import { useAuth } from "@/lib/hooks/useAuth";
import { useFormattedTime } from "@/lib/hooks/useFormattedTime";
import { CommentItem } from "./CommentItem";
import { VisitorView } from "./VisitorView";
import AddCommentForm from "./AddCommentForm";

export default function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { comments, addComment } = useComments(Number(postId));
  const { user } = useAuth();
  const { formatTime } = useFormattedTime();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const success = await addComment(newComment, user);
    if (success) {
      setNewComment("");
    }
  };

  return (
    <div className="mt-8 border-t pt-8 border-gray-200">
      <h4 className="mb-8">Comments</h4>
      <VisitorView user={user} />
      <AddCommentForm
        user={user}
        handleSubmitComment={handleSubmitComment}
        newComment={newComment}
        setNewComment={setNewComment}
      />
      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
}
