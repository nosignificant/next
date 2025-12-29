"use client";

import { useState } from "react";
import clsx from "clsx";

type TagFilterProps = {
  tags: string[];           
  selectedTag: string;      
  onSelect: (tag: string) => void; 
};

export default function TagFilter({ tags, selectedTag, onSelect }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const visibleTags = isOpen ? tags : tags.slice(0, 15);
  const hasMore = tags.length > 15;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-1.5 items-center">
        
        {/* All 버튼 */}
        <button
          onClick={() => onSelect("")}
          className={clsx(
            "px-2 py-1 rounded-full text-xs transition-colors border",
            selectedTag === ""
              ? "bg-neutral-800 text-white border-neutral-800"
              : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
          )}
        >
          All
        </button>

        {visibleTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={clsx(
              "px-2 py-1 rounded-full text-xs transition-colors border",
              selectedTag === tag
                ? "bg-neutral-800 text-white border-neutral-800"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {tag}
          </button>
        ))}

        {/* 더보기 버튼 */}
        {hasMore && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] text-neutral-400 underline underline-offset-2 ml-1 hover:text-neutral-800"
          >
            {isOpen ? "접기" : `+ ${tags.length - 15} more`}
          </button>
        )}
      </div>
    </div>
  );
}