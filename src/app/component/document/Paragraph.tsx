import type { DetailedHTMLProps, HTMLAttributes } from "react";
import clsx from "clsx";

type HProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Paragraph({
  as: Tag = "h2",
  className,
  ...props
}: HProps & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  const sizes: Record<string, string> = {
    p: "text-sm font-medium mt-2 mb-1",
  };

  return <Tag className={clsx(sizes[Tag], className)} {...props} />;
}
