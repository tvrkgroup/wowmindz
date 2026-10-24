"use client";

import { useRef } from "react";
import styles from "./ProductNavigation.module.css";

export default function ProductNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
    onNavigate?.();
  };
  return (
    <details
      ref={menu}
      className={styles.menu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          event.currentTarget.open = false;
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>Products</summary>
      <div className={styles.panel}>
        <a href="https://lms.wowmindz.com/" onClick={close}>LexaMent <small>Modular management platform</small></a>
        <div className={styles.division}>
          <a href="https://lms.wowmindz.com/edlexa" onClick={close}>EdLexa <small>Available now</small></a>
          <div className={styles.children}>
            <a href="https://lms.wowmindz.com/courselexa" onClick={close}>CourseLexa</a>
            <a href="https://lms.wowmindz.com/quizlexa" onClick={close}>QuizLexa</a>
          </div>
          <a href="https://lms.wowmindz.com/medlexa" onClick={close}>MedLexa <small>Coming soon</small></a>
          <a href="https://lms.wowmindz.com/bldlexa" onClick={close}>BldLexa <small>Coming soon</small></a>
        </div>
      </div>
    </details>
  );
}
