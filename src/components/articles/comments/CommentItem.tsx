import React from "react";
import { Comment } from "@/types/supabase";

interface CommentItemProps {
  comment: Comment;
  formatTime: (timestamp: string) => string;
}

export const CommentItem = React.memo(
  ({ comment, formatTime }: CommentItemProps) => {
    if (!comment.User) return null;

    return (
      <div className="mb-6 flex gap-4">
        <div className="h-11 w-11 flex-shrink-0 rounded-full outline outline-1 outline-black/20 bg-gray-200 text-black/20 flex items-center justify-center text-lg font-semibold">
          {comment.User.name ? comment.User.name.charAt(0).toUpperCase() : "AA"}
        </div>
        <div>
          <div className="flex items-center mb-2 gap-2">
            <span className="font-bold">
              {comment.User.name?.split(" ")[0] || "Anonymous"}
            </span>
            <span className="text-sm text-gray-500">
              {formatTime(comment.createdAt)}
            </span>
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";
