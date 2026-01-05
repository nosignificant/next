"use client";

import React, { ComponentPropsWithoutRef, ReactNode } from "react";

const extractText = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
};

export default function BlockCode({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const codeContent = extractText(children).replace(/\n$/, "");

  const highlightCode = (code: string) => {
    return code.split("\n").map((line, lineIdx) => {
      const commentIndex = line.indexOf("//");
      let codePart = line;
      let commentPart = "";

      if (commentIndex !== -1) {
        codePart = line.substring(0, commentIndex);
        commentPart = line.substring(commentIndex);
      }

      return (
        <div key={lineIdx}>
          {codePart.split(/(\s+)/).map((part, i) => {
            const keywords = /^(return|new|if|for|while|float|int|public|private|static|class|using|var|const|type|foreach|Vector2|Vector3|Quaternion|Mathf|Target|ToolTip|transform|rotation|position|GLuint)$/;
            if (keywords.test(part)) {
              return <span key={i} style={{ color: "var(--blue-700)", fontWeight: 500 }}>{part}</span>;
            }
            return part;
          })}
          {commentPart && (
            <span style={{ color: "#a1a1aa", fontStyle: "italic" }}>
              {commentPart}
            </span>
          )}
          {lineIdx < code.split("\n").length - 1 && "\n"}
        </div>
      );
    });
  };

  return (
    <pre
      className="bg-neutral-50 !border !border-neutral-200 !text-neutral-600 rounded-md p-5 overflow-x-auto my-6 text-[13px] !font-mono !tracking-normal leading-[1.6]"
      {...props}
    >
      <code className="!bg-transparent !p-0 border-none !font-mono whitespace-pre">
        {highlightCode(codeContent)}
      </code>
    </pre>
  );
}