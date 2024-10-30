import { createClient } from "@/lib/supabase/supabase-client";
import { toast } from "react-hot-toast";
import { Article } from "@/lib/types/supabase";

export function useArticleActions(
  articles: Article[],
  setArticles: (articles: Article[]) => void
) {
  const handleDeleteArticle = async (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      const supabase = createClient();
      const deletePromise = async () => {
        // First delete the PostImage
        const imageResponse = await supabase
          .from("PostImage")
          .delete()
          .eq("postId", id);

        if (imageResponse.error) throw imageResponse.error;

        // Then delete the Comments
        const commentsResponse = await supabase
          .from("Comment")
          .delete()
          .eq("postId", id);

        if (commentsResponse.error) throw commentsResponse.error;

        // Finally delete the Post
        const postResponse = await supabase.from("Post").delete().eq("id", id);

        if (postResponse.error) throw postResponse.error;
        return postResponse;
      };

      await toast.promise(deletePromise(), {
        loading: "Deleting article...",
        success: () => {
          const newArticles = articles.filter((article) => article.id !== id);
          setArticles(newArticles);
          return "Article deleted successfully";
        },
        error: (err: Error) => `Failed to delete article: ${err.message}`,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const handleDeleteSelected = async (selectedIds: number[]) => {
    if (
      !window.confirm("Are you sure you want to delete the selected articles?")
    )
      return;

    try {
      const supabase = createClient();
      const deletePromise = async () => {
        // First delete all related PostImages
        const imageResponse = await supabase
          .from("PostImage")
          .delete()
          .in("postId", selectedIds);

        if (imageResponse.error) throw imageResponse.error;

        // Then delete all related Comments
        const commentsResponse = await supabase
          .from("Comment")
          .delete()
          .in("postId", selectedIds);

        if (commentsResponse.error) throw commentsResponse.error;

        // Finally delete the Posts
        const postResponse = await supabase
          .from("Post")
          .delete()
          .in("id", selectedIds);

        if (postResponse.error) throw postResponse.error;
        return postResponse;
      };

      await toast.promise(deletePromise(), {
        loading: "Deleting selected articles...",
        success: () => {
          const newArticles = articles.filter(
            (article) => !selectedIds.includes(article.id)
          );
          setArticles(newArticles);
          return `Successfully deleted ${selectedIds.length} article(s)`;
        },
        error: (err: Error) => `Failed to delete articles: ${err.message}`,
      });
    } catch (error) {
      console.error("Error deleting articles:", error);
      toast.error("Failed to delete articles");
    }
  };

  return { handleDeleteArticle, handleDeleteSelected };
}
