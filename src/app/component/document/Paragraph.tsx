import type { DetailedHTMLProps, HTMLAttributes } from "react";
import clsx from "clsx";

type PProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function Paragraph({ className, ...props }: PProps) {
  return (
    <p className={clsx("text-[0.9rem] leading-[28px]", className)} {...props} />
  );
}
