import { useEffect } from "react";

export const MobileOptimizations = () => {
  useEffect(() => {
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = "none";
    
    // Prevent zoom on input focus (iOS)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    // Add mobile-specific class
    document.documentElement.classList.add("mobile-optimized");

    // Prevent context menu on long press
    const preventContextMenu = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName !== "INPUT" && 
          (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu as any);

    return () => {
      document.body.style.overscrollBehavior = "auto";
      document.removeEventListener("contextmenu", preventContextMenu as any);
    };
  }, []);

  return null;
};
