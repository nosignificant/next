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
    <div className="flex items-start">
      <div className="flex flex-wrap gap-2 items-start">
        
        {/* --- ALL 버튼 --- */}
        <button
          onClick={() => onSelect("")}
          className="relative flex flex-col items-start w-fit group" /* flex-col로 변경하여 선을 글자 밑으로 배치 */
        >
          <span 
            className={clsx(
              "text-[13px] uppercase transition-colors",
              selectedTag === "" ? "font-bold" : "text-neutral-400 group-hover:text-black"
            )}
            style={{ 
              color: selectedTag === "" ? "var(--tag-default, #000)" : "var(--blue-700)" 
            }}
          >
            All
          </span>
          <div 
            className="h-[0.5px] w-full"
            style={{
              backgroundColor: selectedTag === "" ? "var(--tag-default, #000)" : "var(--blue-700)",
              opacity:  1
            }}
          />
        </button>

        {/* --- 태그 리스트 --- */}
        {visibleTags.map((tag) => {
          const isSelected = selectedTag === tag;
          const tagColor = isSelected ? `var(--tag-default)` : `var(--blue-700)`;

          return (
            <button
              key={tag}
              onClick={() => onSelect(tag)}
              className="relative flex flex-col items-start w-fit group"
            >
              <span 
                className={clsx(
                  "text-[13px] uppercase transition-colors text-left",
                  isSelected ? "font-bold" : "text-neutral-400 group-hover:text-black"
                )}
                style={{ color: isSelected ? tagColor : "var(--blue-700)" }}
              >
                {tag}
              </span>
              
              {/* ✅ 글자 밑 실선 추가 */}
              <div 
                className="h-[0.5px] w-full"
                style={{
                  backgroundColor: isSelected ? tagColor : "var(--blue-700)",
                  opacity: 1 
                }}
              />
            </button>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] text-neutral-400 mt-2 hover:text-black transition-colors"
          >
            {isOpen ? "[ CLOSE ]" : `[ + ${tags.length - 15} MORE ]`}
          </button>
        )}
      </div>
    </div>
  );
}