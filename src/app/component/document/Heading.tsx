import type { DetailedHTMLProps, HTMLAttributes } from "react";
import clsx from "clsx";

type HProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Heading({
  as: Tag = "h2",
  className,
  ...props
}: HProps & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  const sizes: Record<string, string> = {
    h1: "text-2xl pt-4 pb-2 font-bold no-underline",
    h2: "text-xl pt-4 pb-2  font-semibold no-underline",
    h3: "text-xl pt-4 pb-2 font-semibold no-underline",
    h4: "text-lg font-medium no-underline",
    h5: "text-base font-semibold no-underline",
    h6: "text-base font-semibold no-underline",
  };

  return <Tag className={clsx(sizes[Tag], className)} {...props} />;
}
