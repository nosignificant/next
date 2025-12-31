// src/component/WorkFilter.tsx
"use client";

import clsx from "clsx";

type Props = {
  tags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
};

export default function WorkFilter({ tags, selectedTag, onSelect }: Props) {
  return (
    <div className="flex flex-col items-start "> 
      <div className="flex flex-col gap-[8px] items-start">
        {tags.map((tag) => {
          const lowerTag = tag.toLowerCase();
          const isSelected = selectedTag === tag;
          
          const tagColor = isSelected 
            ? `var(--tag-${lowerTag}, var(--tag-default))` 
            : `var(--blue-700)`;

          return (
            <button
              key={tag}
              onClick={() => onSelect(tag)}
              className="relative flex flex-col items-start w-fit group"
            >
              <span className={clsx(
                "text-[13px]",
                !isSelected && "text-neutral-400"
              )}
              style={{ color: isSelected ? tagColor : "var(--blue-700)" }}
              >
                {tag}
              </span>
              
              {/* ✅ 하단 실선 설정 */}
              <div 
                className="w-full"
                style={{
                  backgroundColor: isSelected ? tagColor : "var(--blue-700)",
                  height: "1px",
                  opacity: 1 
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}