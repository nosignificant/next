import { useState, useEffect } from "react";
import { Post } from "../lib/type";

type HomeProps = { post: Post };

export default function HomeInteraction({ post }: HomeProps) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", function () {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    });
  });

  const slice = 4;
  const sliceMore = Math.floor(Math.random() * 2);
  console.log("Random number: ", sliceMore);
  const boxSize = {
    width: window.innerWidth / slice,
    height: window.innerHeight / slice,
  };

  return;
}
