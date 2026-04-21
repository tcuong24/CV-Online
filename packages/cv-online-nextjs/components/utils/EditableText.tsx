"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";

export function EditableText({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing]);

  const save = () => {
    setEditing(false);
    onChange(text);
  };

  return editing ? (
    <Input
      ref={ref}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") {
          setText(value);
          setEditing(false);
        }
      }}
      className="h-8"
    />
  ) : (
    <div
      onClick={() => setEditing(true)}
      className="cursor-pointer group hover:bg-muted px-2 py-1 rounded flex"
    >
      {value || "Click để nhập..."}
      <Pen className="group-hover:block hidden w-4 h-4 ml-2" />
    </div>
  );
}