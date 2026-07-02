"use client";
import { useEffect } from "react";

export function NavHider() {
  useEffect(() => {
    const nav = document.querySelector("header[class*='fixed']") as HTMLElement | null;
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 80) {
        nav.style.transform = "translateY(-120%)";
        nav.style.transition = "transform 0.3s ease";
      } else {
        nav.style.transform = "translateY(0)";
        nav.style.transition = "transform 0.3s ease";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      nav.style.transform = "";
    };
  }, []);

  return null;
}
