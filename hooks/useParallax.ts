"use client";

import { useEffect, useState } from "react";

interface UseParallaxOptions {
  speed?: number;
  offset?: number;
}

export function useParallax({ speed = 0.5, offset = 0 }: UseParallaxOptions = {}) {
  const [transform, setTransform] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setTransform(scrolled * speed + offset);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", onScroll);
  }, [speed, offset]);

  return transform;
}

