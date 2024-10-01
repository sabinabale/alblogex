import InputLabel from "./basic/InputLabel";

export default function TextEditor({
  markdownContent,
  setMarkdownContent,
}: {
  markdownContent: string;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <InputLabel variant="article" htmlFor="articleContent">
        Article Content
      </InputLabel>
      <textarea
        id="articleContent"
        placeholder="Article Content"
        className="p-2 h-80 border border-gray-300 resize-none overflow-auto"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
      />
    </>
  );
}
