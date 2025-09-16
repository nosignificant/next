import type { DetailedHTMLProps, HTMLAttributes } from "react";
import clsx from "clsx";

type PProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function Paragraph({ className, ...props }: PProps) {
  return (
    <p
      className={clsx("text-[0.95rem] leading-[24.5px]", className)}
      {...props}
    />
  );
}
