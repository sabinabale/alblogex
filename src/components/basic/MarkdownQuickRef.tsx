import Image from "next/image";
import bulbicon from "@/assets/icons/bulb.svg";

export default function MarkdownQuickRef() {
  return (
    <aside
      className="mt-7 border border-cyan-600/30 bg-cyan-600/20 rounded-md pl-4 pr-8 py-6 h-fit"
      aria-labelledby="quickref-title"
    >
      <h2
        id="quickref-title"
        className="font-bold mb-4 flex gap-2 items-center"
      >
        <Image src={bulbicon} alt="" />
        Quick Markdown Refresher
      </h2>
      <ul
        className="space-y-0.5 text-[14px]"
        aria-label="Markdown syntax examples"
      >
        <li className="pl-8">
          # <span className="font-semibold">Headings Start With A Hash</span>
        </li>
        <li className="pl-8">
          - Use Two Asterisks To Make Text ✳✳
          <span className="font-bold">Bold</span>✳✳
        </li>
        <li className="pl-8">
          - Use One Asterisk To Make Text ✳
          <span className="italic">Italic</span>✳
        </li>
        <li className="pl-8">- Use A Blank Line To Separate Paragraphs</li>
      </ul>
      <p className="pt-4 pl-2">
        See More Here:{" "}
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-700 underline underline-offset-2 font-medium"
        >
          Markdown Guide
        </a>
      </p>
    </aside>
  );
}
