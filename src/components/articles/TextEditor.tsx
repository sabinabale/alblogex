import InputLabel from "../layout/InputLabel";

const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;");
};

const MAX_CONTENT_LENGTH = 50000;

type TextEditorProps = {
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
};

export default function TextEditor({
  markdownContent,
  setMarkdownContent,
}: TextEditorProps) {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length > MAX_CONTENT_LENGTH) {
      return;
    }

    const sanitizedContent = sanitizeInput(value);
    setMarkdownContent(sanitizedContent);
  };

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
        onChange={handleContentChange}
        maxLength={MAX_CONTENT_LENGTH}
        spellCheck={true}
        aria-label="Article content editor"
      />
    </>
  );
}
