"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

export default function CustomSelect({ value, options, onChange, ariaLabel }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const current = useMemo(
    () => options.find((option) => option.value === value) || options[0],
    [options, value]
  );

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDocumentClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onDocumentClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className={`custom-select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="custom-select-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{current?.label || ""}</span>
        <span className="custom-select-caret" aria-hidden="true" />
      </button>
      {open ? (
        <div className="custom-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? "is-selected" : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
