// components/MarkdownRenderer.jsx
"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import "prism-themes/themes/prism-dracula.css"; // Or any Prism theme
import "github-markdown-css/github-markdown.css"

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="flex justify-center mt-10">
      <div className="prose prose-gag dark:prose-invert no-preflight max-w-none w-full">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypePrism]}
          children={content}
        />
      </div>
    </div>

  );
};

export default MarkdownRenderer;
