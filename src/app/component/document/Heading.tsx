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
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium",
    h5: "text-base font-semibold",
    h6: "text-base font-semibold",
  };

  return <Tag className={clsx(sizes[Tag], className)} {...props} />;
}
