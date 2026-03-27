"use client";

import { useEffect, useState } from "react";
import { BROWN, LIGHT_BROWN, ORANGE } from "@/lib/helper";

const words = ["A2 cow ghee", "organic khapli atta", "hard pressed oils", "organic spices"];

const SearchBar = () => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === currentWord.length) {
          setIsDeleting(true);
        }
      } else {
        setText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className="relative w-fit">
      {/* Fake placeholder */}
      {!inputValue && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm">
          <span style={{ color: BROWN }}>Search for </span>
          <span style={{ color: ORANGE }}>{text}</span>
          <span style={{
            animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>|</span>
        </div>
      )}

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="input shadow-lg px-3 py-1 rounded-sm w-56 transition-all focus:w-64 focus:outline-2"
        style={{
          backgroundColor: "#fff",
          borderColor: BROWN,
          outlineColor: LIGHT_BROWN,
          color: BROWN,
        }}
        type="text"
      />

      <svg
        className="size-6 absolute top-1 right-2"
        style={{ color: BROWN }}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default SearchBar;