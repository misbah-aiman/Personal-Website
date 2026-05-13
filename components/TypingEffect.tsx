"use client";

import { useEffect, useState } from "react";

type Props = {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
};

export default function TypingEffect({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseMs = 1400,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? current.substring(0, prev.length - 1)
              : current.substring(0, prev.length + 1),
          );
        },
        deleting ? deletingSpeed : typingSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span
        aria-hidden
        className="ml-1 inline-block h-[1em] w-[3px] -translate-y-[2px] animate-blink bg-current align-middle"
      />
    </span>
  );
}
