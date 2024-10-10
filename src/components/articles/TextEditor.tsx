import InputLabel from "../basic/InputLabel";

type TextEditorProps = {
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
};

export default function TextEditor({
  markdownContent,
  setMarkdownContent,
}: TextEditorProps) {
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
