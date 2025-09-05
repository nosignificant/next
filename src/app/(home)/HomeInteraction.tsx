import { useState, useEffect } from "react";

export default function HomeInteraction() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", function () {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    });
  });
}
