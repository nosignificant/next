import { FormattedText } from "../../lib/type";
import React from "react";

export default function InlineText({ text }: { text: FormattedText }) {
  const styles: string[] = [];

  // 1. 기본 스타일
  if (text.bold) styles.push("font-bold text-black");
  if (text.italic) styles.push("italic");
  if (text.underline) styles.push("underline underline-offset-4 decoration-neutral-300");
  if (text.strikethrough) styles.push("line-through decoration-neutral-400 text-neutral-400");
  
  if (text.code) {
    styles.push(
      "text-xs font-mono text-pink-600 bg-neutral-100 rounded px-1.5 py-0.5 mx-0.5 align-middle tracking-tight"
    );
  }

  // 3. 기타 스타일
  if (text.keyboard) styles.push("text-xs font-mono bg-neutral-100 border border-b-2 border-neutral-200 rounded px-1.5 py-0.5 mx-0.5");
  if (text.subscript) styles.push("text-[10px] align-sub");
  if (text.superscript) styles.push("text-[10px] align-super");

  const style = styles.join(" ");

  if (text.code) {
    return <code className={style}>{text.text}</code>;
  } else if (text.subscript) {
    return <sub className={style}>{text.text}</sub>;
  } else if (text.superscript) {
    return <sup className={style}>{text.text}</sup>;
  } else if (text.bold) {
    return <strong className={style}>{text.text}</strong>;
  } else if (text.italic) {
    return <em className={style}>{text.text}</em>;
  } else if (text.keyboard) {
    return <kbd className={style}>{text.text}</kbd>;
  } else {
    // underline, strikethrough 등은 span으로 처리
    return <span className={style}>{text.text}</span>;
  }
}