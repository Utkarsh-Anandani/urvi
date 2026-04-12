"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  id?: string;
  placeholder?: string;
};

export const TagInput = ({
  value,
  onChange,
  id = "tags",
  placeholder = "Add tags",
}: TagInputProps) => {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized) return;

    // prevent duplicates
    if (value.includes(normalized)) return;

    onChange([...value, normalized]);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      addTag(input);
      setInput("");
    }

    // remove last tag with backspace
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div id={id} className="border rounded-md px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1"
          >
            <X size={14} />
          </button>
        </Badge>
      ))}

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 shadow-none flex-1 min-w-30"
      />
    </div>
  );
};