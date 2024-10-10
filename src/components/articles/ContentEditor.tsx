import React from "react";
import TextEditor from "./TextEditor";
import MarkdownQuickRef from "../basic/MarkdownQuickRef";

type ContentEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
};

export default function ContentEditor({
  content,
  onContentChange,
}: ContentEditorProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-1 w-full md:w-1/2">
        <TextEditor
          markdownContent={content}
          setMarkdownContent={onContentChange}
        />
      </div>
      <MarkdownQuickRef />
    </div>
  );
}
