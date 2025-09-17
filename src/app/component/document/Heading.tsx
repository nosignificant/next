import type { DetailedHTMLProps, HTMLAttributes } from "react";
import clsx from "clsx";
import { slugify } from "@/app/lib/slugify";

type HProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Heading({
  as: Tag = "h2",
  className,
  id,
  children,
  ...props
}: HProps & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  const sizes: Record<string, string> = {
    h1: "text-2xl pt-4 pb-2 font-bold no-underline",
    h2: "text-xl pt-4 pb-2 font-semibold no-underline",
    h3: "text-xl pt-4 pb-2 font-semibold no-underline",
    h4: "text-lg font-medium no-underline",
    h5: "text-base font-semibold no-underline",
    h6: "text-base font-semibold no-underline",
  };

  const computedId =
    id ?? (typeof children === "string" ? slugify(children) : undefined);

  return (
    <Tag id={computedId} className={clsx(sizes[Tag], className)} {...props}>
      {children}
    </Tag>
  );
}
