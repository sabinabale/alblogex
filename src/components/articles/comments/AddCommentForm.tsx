import { User } from "@/lib/types/supabase";

const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;")
    .trim();
};

export default function AddCommentForm({
  user,
  handleSubmitComment,
  newComment,
  setNewComment,
}: {
  user: User | null;
  handleSubmitComment: (e: React.FormEvent) => void;
  newComment: string;
  setNewComment: (value: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setNewComment(sanitizedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(e);
    }
  };

  return (
    <>
      {user && (
        <div className="flex gap-4 mb-6">
          <div className="bg-gray-200 rounded-full w-11 h-11 flex-shrink-0">
            <div className="h-11 w-11 flex-shrink-0 rounded-full outline outline-1 outline-black/20 bg-gray-200 text-black/20 flex items-center justify-center text-lg font-semibold">
              {user?.user_metadata?.name
                ? sanitizeInput(user.user_metadata.name).charAt(0).toUpperCase()
                : "AA"}
            </div>
          </div>
          <form onSubmit={handleSubmitComment} className="relative w-full">
            <textarea
              value={newComment}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border rounded-md resize-none text-base"
              placeholder="Join the discussion"
              required
              maxLength={500}
            />
            <button
              type="submit"
              className="absolute bottom-3 right-1 w-fit px-1 py-0.5 rounded-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-20 hover:opacity-100 transition-all duration-200 ease-in-out "
              >
                <path
                  d="M5.99997 12H9.24997M5.99997 12L3.3817 4.14513C3.24083 3.72253 3.68122 3.34059 4.07964 3.5398L20.1055 11.5528C20.4741 11.737 20.4741 12.2629 20.1055 12.4472L4.07964 20.4601C3.68122 20.6593 3.24083 20.2774 3.3817 19.8548L5.99997 12Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
