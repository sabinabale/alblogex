import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownPreviewProps = {
  content: string;
};

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="w-full md:w-1/2">
      <div id="previewLabel">Preview</div>
      <div
        className="px-3 py-1.5 border border-gray-300 rounded-md prose bg-white h-80 overflow-auto leading-normal"
        aria-labelledby="previewLabel"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
