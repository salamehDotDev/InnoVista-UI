"use client";

import React, { useEffect, useRef, useId, useState, useCallback, useMemo, ReactNode, lazy, Suspense } from "react";
import ScrollAnimationCardsCtrl from "./controller/ScrollAnimationCards.ctrl";

// Lazy load child components to reduce initial bundle size
const JsxSnapDirectionType = lazy(() => import("./components/jsxSnapDirectionType"));
const MainJSX = lazy(() => import("./components/mainJSX"));

// Type definitions for GSAP (simplified for lazy loading)
type GSAPAnimate = {
  registerPlugin: (...args: unknown[]) => void;
  [key: string]: unknown;
};

type GSAPScrollTrigger = {
  config: (options: Record<string, unknown>) => void;
  getAll: () => Array<{ kill: () => void }>;
  [key: string]: unknown;
};

// Lazy load GSAP only when needed (not for snap direction)
let animate: GSAPAnimate | null = null;
let ScrollTrigger: GSAPScrollTrigger | null = null;

const loadGSAP = async (): Promise<{ animate: GSAPAnimate; ScrollTrigger: GSAPScrollTrigger }> => {
  if (!animate) {
    const { animate: gsapAnimate } = await import("./Helpers");
    const { ScrollTrigger: gsapScrollTrigger } = await import("./Helpers/ScrollTrigger");
    animate = gsapAnimate as GSAPAnimate;
    ScrollTrigger = gsapScrollTrigger as unknown as GSAPScrollTrigger;

    // Configure ScrollTrigger for better mobile performance
    gsapAnimate.registerPlugin(gsapScrollTrigger);
    gsapScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      limitCallbacks: true,
      ignoreMobileResize: true,
    });
  }
  return { animate: animate as GSAPAnimate, ScrollTrigger: ScrollTrigger as GSAPScrollTrigger };
};

// Package prefix for unique class naming
const PKG_PREFIX = "smd-cards-scroll";

// CSS styles as a string - injected at runtime
const CSS_STYLES = `/* Cards Scroll Animation Styles - Package: ${PKG_PREFIX} */

/* Main scroll section container */
.${PKG_PREFIX}__scroll-section-container {
  color: #292929;
  font-family: sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  overflow-x: hidden;
  transition: color 0.3s, background-color 0.3s;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-size-adjust: 100%;
  touch-action: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.${PKG_PREFIX}__scroll-section-container * {
  -webkit-text-size-adjust: none;
  -moz-text-size-adjust: none;
  -ms-text-size-adjust: none;
  text-size-adjust: none;
}

/* Section styles - CRITICAL for animation */
.${PKG_PREFIX}__section {
  overflow: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  touch-action: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  min-height: 100vh;
}

/* Wrapper styles - CRITICAL for animation */
.${PKG_PREFIX}__wrapper {
  height: 100vh;
  transform-style: preserve-3d;
  transform-origin: center bottom;
  will-change: transform;
  backface-visibility: hidden;
  position: relative;
  width: 100%;
  min-height: 100vh;
  touch-action: auto;
}

/* List styles */
.${PKG_PREFIX}__list {
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  display: flex;
  position: relative;
  padding: 0.2rem;
}

/* Item styles - CRITICAL for animation */
.${PKG_PREFIX}__item {
  width: 100vw !important;
  height: 100vh !important;
  display: flex;
  position: absolute;
  inset: 0%;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
}

/* Item content styles - CRITICAL for animation */
.${PKG_PREFIX}__item_content {
  flex-flow: column;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  position: relative;
  width: 100% !important;
  height: 100% !important;
  min-height: 100vh;
  border-radius: 20px;
  box-shadow: 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 
              0 149px 60px #0000000a, 0 233px 65px #00000003;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.${PKG_PREFIX}__item_content:hover {
  box-shadow: 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 
              0 149px 60px #0000000a, 0 233px 65px #00000003, 0 0 0 2px rgba(255, 255, 255, 0.1);
}

/* Padding styles */
.${PKG_PREFIX}__padding-global {
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
}

.${PKG_PREFIX}__padding-vertical {
  padding: 2rem;
}

/* Container styles */
.${PKG_PREFIX}__container-medium {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem !important;
}

.${PKG_PREFIX}__max-width-large {
  max-width: 800px;
  margin: 0 auto;
}

/* 3D Direction Specific Styles */
.${PKG_PREFIX}__three-d-section {
  perspective: 1000px;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3D wrapper styles */
.${PKG_PREFIX}__three-d-wrapper {
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.02s ease-out;
  will-change: transform;
  backface-visibility: hidden;
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3D list styles */
.${PKG_PREFIX}__three-d-list {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3D item styles */
.${PKG_PREFIX}__three-d-item {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 400px;
  transform-origin: center center;
}

/* 3D item content styles */
.${PKG_PREFIX}__three-d-item_content {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  border-radius: 20px;
  border: 3px solid #6C6C6C;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  box-shadow: 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 
              0 149px 60px #0000000a, 0 233px 65px #00000003;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  transform-origin: center center;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

/* Scroll snapping container */
.${PKG_PREFIX}__scroll-snapping-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.${PKG_PREFIX}__scroll-snapping-content {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
}

.${PKG_PREFIX}__scroll-snapping-content::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  width: 0;
  height: 0;
  background: transparent;
}

.${PKG_PREFIX}__scroll-snapping-content::-webkit-scrollbar-track {
  display: none;
  background: transparent;
}

.${PKG_PREFIX}__scroll-snapping-content::-webkit-scrollbar-thumb {
  display: none;
  background: transparent;
}

.${PKG_PREFIX}__section-content {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}

/* Scroll indicator */
.${PKG_PREFIX}__scroll-indicator {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 10px;
}

.${PKG_PREFIX}__scroll-indicator-dots {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.${PKG_PREFIX}__scroll-indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.${PKG_PREFIX}__scroll-indicator-dot:hover {
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.${PKG_PREFIX}__scroll-indicator-dot::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.${PKG_PREFIX}__scroll-indicator-dot:hover::before {
  opacity: 1;
}

.${PKG_PREFIX}__scroll-indicator-dot:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.${PKG_PREFIX}__active {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 1);
  transform: scale(1.3);
}

.${PKG_PREFIX}__active::before {
  opacity: 1;
}

/* Scroll snap mode */
.${PKG_PREFIX}__scroll-snap-mode .${PKG_PREFIX}__section {
  height: 100vh !important;
  width: 100% !important;
  overflow: hidden;
}

.${PKG_PREFIX}__scroll-snap-mode .${PKG_PREFIX}__item {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.${PKG_PREFIX}__scroll-snap-mode .${PKG_PREFIX}__wrapper {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Screen reader only */
.${PKG_PREFIX}__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Prevent zoom */
.${PKG_PREFIX}__prevent-zoom {
  touch-action: pan-x pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

.${PKG_PREFIX}__prevent-zoom * {
  touch-action: pan-x pan-y;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Responsive styles for mobile devices */
@media (max-width: 480px) {
  .${PKG_PREFIX}__wrapper {
    transform-origin: center bottom;
  }
  .${PKG_PREFIX}__item_content {
    border-radius: 15px;
  }
  .${PKG_PREFIX}__three-d-item_content {
    border-radius: 15px;
  }
  .${PKG_PREFIX}__scroll-indicator {
    right: 0.5rem;
  }
  .${PKG_PREFIX}__scroll-indicator-dots {
    gap: 0.75rem;
  }
  .${PKG_PREFIX}__scroll-indicator-dot {
    width: 8px;
    height: 8px;
  }
}

/* Responsive styles for tablet devices */
@media (min-width: 481px) and (max-width: 768px) {
  .${PKG_PREFIX}__wrapper {
    transform-origin: center bottom;
  }
  .${PKG_PREFIX}__item_content {
    border-radius: 18px;
  }
  .${PKG_PREFIX}__three-d-item_content {
    border-radius: 18px;
  }
  .${PKG_PREFIX}__scroll-indicator {
    right: 1rem;
  }
  .${PKG_PREFIX}__scroll-indicator-dot {
    width: 10px;
    height: 10px;
  }
}

/* Responsive styles for desktop devices */
@media (min-width: 769px) {
  .${PKG_PREFIX}__wrapper {
    transform-origin: center bottom;
  }
  .${PKG_PREFIX}__item_content {
    border-radius: 25px;
  }
  .${PKG_PREFIX}__three-d-item_content {
    border-radius: 25px;
  }
}`;

/**
 * Injects CSS styles into the document head with optimized performance
 * Injects immediately for critical styles to prevent layout shift
 * @returns {void}
 */
const injectStyles = (): void => {
  if (typeof document === "undefined") return;

  const styleId = `${PKG_PREFIX}-styles`;

  // Check if styles are already injected to prevent duplicates
  if (document.getElementById(styleId)) return;

  // Inject styles immediately to prevent layout shift (CLS)
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = CSS_STYLES;

  // Use high priority for style injection
  const firstScript = document.head.querySelector("script");
  if (firstScript) {
    document.head.insertBefore(style, firstScript);
  } else {
    document.head.appendChild(style);
  }
};

/**
 * Class names mapping for the component
 * Uses BEM-like naming convention with package prefix
 */
const classesName = {
  scroll_section_container: `${PKG_PREFIX}__scroll-section-container`,
  section: `${PKG_PREFIX}__section`,
  wrapper: `${PKG_PREFIX}__wrapper`,
  list: `${PKG_PREFIX}__list`,
  item: `${PKG_PREFIX}__item`,
  item_content: `${PKG_PREFIX}__item_content`,
  padding_global: `${PKG_PREFIX}__padding-global`,
  padding_vertical: `${PKG_PREFIX}__padding-vertical`,
  container_medium: `${PKG_PREFIX}__container-medium`,
  max_width_large: `${PKG_PREFIX}__max-width-large`,
  three_d_section: `${PKG_PREFIX}__three-d-section`,
  three_d_wrapper: `${PKG_PREFIX}__three-d-wrapper`,
  three_d_list: `${PKG_PREFIX}__three-d-list`,
  three_d_item: `${PKG_PREFIX}__three-d-item`,
  three_d_item_content: `${PKG_PREFIX}__three-d-item_content`,
  scroll_snapping_container: `${PKG_PREFIX}__scroll-snapping-container`,
  scroll_snapping_content: `${PKG_PREFIX}__scroll-snapping-content`,
  section_content: `${PKG_PREFIX}__section-content`,
  scroll_indicator: `${PKG_PREFIX}__scroll-indicator`,
  scroll_indicator_dots: `${PKG_PREFIX}__scroll-indicator-dots`,
  scroll_indicator_dot: `${PKG_PREFIX}__scroll-indicator-dot`,
  active: `${PKG_PREFIX}__active`,
  scroll_snap_mode: `${PKG_PREFIX}__scroll-snap-mode`,
  scroll_section: `${PKG_PREFIX}__scroll-section`,
  three_d: `${PKG_PREFIX}__three-d`,
  sr_only: `${PKG_PREFIX}__sr-only`,
  heading: `${PKG_PREFIX}__heading`,
  prevent_zoom: `${PKG_PREFIX}__prevent-zoom`,
} as const;

/**
 * Classes object - maps keys to actual class names (mimics StyleBuilder output)
 * The child components use classes[classesName.xyz] to get the actual class string
 * Memoized outside component to prevent recreation on every render
 */
const classes: Record<string, string> = Object.keys(classesName).reduce((acc, key) => {
  const className = classesName[key as keyof typeof classesName];
  acc[className] = className;
  return acc;
}, {} as Record<string, string>);

/**
 * Throttle function to limit how often a function can be called
 * Improves performance by reducing function execution frequency
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function to delay execution until after a pause in calls
 * Useful for resize handlers and other frequently called events
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Type definitions
export interface CardsScrollProps {
  children: ReactNode;
  direction?: "vertical" | "horizontal" | "3d" | "snap";
  backgroundColor?: string;
  lastCardZoomOut?: boolean;
  enableScrollSnap?: boolean;
  snapType?: "mandatory" | "proximity";
  enableKeyboardNav?: boolean;
  enableScrollIndicator?: boolean;
}

/**
 * CardsScroll component - A scroll-based cards animation component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - React children components (each child becomes a card)
 * @param {string} props.direction - Animation direction: "vertical", "horizontal", "3d", or "snap"
 * @param {string} props.backgroundColor - Background color for the container section
 * @param {boolean} props.lastCardZoomOut - Whether the last card should zoom out (default: true)
 * @param {boolean} props.enableScrollSnap - Whether to enable scroll snapping (default: false)
 * @param {string} props.snapType - Scroll snap type: "mandatory" or "proximity" (default: "mandatory")
 * @param {boolean} props.enableKeyboardNav - Whether to enable keyboard navigation for "snap" direction (default: true)
 * @param {boolean} props.enableScrollIndicator - Whether to show scroll progress indicator for "snap" direction (default: true)
 */
export const CardsScroll = ({
  children,
  direction = "vertical",
  backgroundColor = "#eeeeee",
  lastCardZoomOut = true,
  enableScrollSnap = false,
  snapType = "mandatory",
  enableKeyboardNav = true,
  enableScrollIndicator = true,
}: CardsScrollProps) => {
  // Refs for DOM elements that need direct manipulation
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  // State for 3D animation effects (only used for "3d" direction)
  const [isMobile, setIsMobile] = useState(false);

  // State for snap direction
  const [currentCard, setCurrentCard] = useState(0);
  const [totalCards, setTotalCards] = useState(0);

  // State to track if GSAP is loaded
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Initialize handlers from controller (memoized)
  const handlers = useMemo(() => ScrollAnimationCardsCtrl(), []);

  // Throttled and debounced handlers for better performance
  // Memoized to prevent recreation on every render
  const checkMobile = useMemo(() => {
    const handler = handlers.checkMobile({ setIsMobile } as unknown as Parameters<typeof handlers.checkMobile>[0]);
    return debounce(handler as (...args: unknown[]) => void, 150); // Debounce resize checks (150ms)
  }, [handlers]);

  const scrollHandler = useMemo(() => {
    const handler = handlers.scrollHandler({ direction, sectionRef });
    return throttle(handler as (...args: unknown[]) => void, 16); // ~60fps throttle for scroll (16ms)
  }, [handlers, direction]);

  const handleScroll = useMemo(() => handlers.handleScroll({ direction, sectionRef } as unknown as Parameters<typeof handlers.handleScroll>[0]), [handlers, direction]);

  // Memoize other handler functions to prevent unnecessary recreations
  const handleSnapScroll = useMemo(() => {
    const handler = handlers.handleSnapScroll({ containerRef, direction, setCurrentCard, totalCards });
    return throttle(handler as (...args: unknown[]) => void, 16); // ~60fps throttle
  }, [handlers, direction, totalCards]);

  const handleKeyDown = useMemo(() => handlers.handleKeyDown({ enableKeyboardNav, direction, containerRef }), [handlers, enableKeyboardNav, direction]);

  const scrollToCard = useMemo(() => handlers.scrollToCard({ direction, containerRef }), [handlers, direction]);

  // Animation initialization functions (only created after GSAP loads)
  // Memoized with useCallback to prevent recreation and ensure stable references
  const init3DScroll = useCallback(
    async (section: HTMLElement, items: NodeListOf<Element>, lastCardZoomOut: boolean) => {
      if (!animate) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInit3DScroll = handlers.init3DScroll({ animate: animate as any, isMobile });
        handleInit3DScroll(section, items, lastCardZoomOut);
      } catch (error) {
      }
    },
    [handlers, isMobile]
  );

  const initScroll = useCallback(
    async (section: HTMLElement, items: NodeListOf<Element>, direction: string, lastCardZoomOut: boolean) => {
      if (!animate) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInitScroll = handlers.initScroll({ animate: animate as any });
        handleInitScroll(section, items, direction, lastCardZoomOut);
      } catch (error) {
      }
    },
    [handlers]
  );

  const init3DScrollSnap = useCallback(
    async (section: HTMLElement, items: NodeListOf<Element>) => {
      if (!animate) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInit3DScrollSnap = handlers.init3DScrollSnap({ animate: animate as any, isMobile });
        handleInit3DScrollSnap(section, items, snapType);
      } catch (error) {
      }
    },
    [handlers, isMobile, snapType]
  );

  const initScrollSnap = useCallback(
    async (section: HTMLElement, items: NodeListOf<Element>, direction: string) => {
      if (!animate) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInitScrollSnap = handlers.initScrollSnap({ animate: animate as any });
        handleInitScrollSnap(section, items, direction, snapType);
      } catch (error) {

      }
    },
    [handlers, snapType]
  );

  /**
   * Inject CSS styles immediately (before first render to prevent layout shift)
   * Moved to useEffect to avoid calling in render phase
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      injectStyles();
    }
  }, []);

  /**
   * Load GSAP only when needed (lazy loading for performance)
   * Uses intersection observer to load GSAP only when component is visible
   */
  useEffect(() => {
    // Early return for SSR or snap direction (which doesn't use GSAP)
    if (typeof window === "undefined" || direction === "snap") return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const initGSAP = async () => {
      try {
        await loadGSAP();
        if (!cancelled) {
          setGsapLoaded(true);
        }
      } catch (error) {
      }
    };

    // Only load GSAP when component becomes visible (reduces initial load)
    const section = sectionRef.current;
    if (section && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            // Component is visible, load GSAP
            if ("requestIdleCallback" in window) {
              requestIdleCallback(() => initGSAP(), { timeout: 1000 });
            } else {
              setTimeout(initGSAP, 50);
            }
            // Disconnect after loading
            observer?.disconnect();
          }
        },
        { rootMargin: "50px" } // Start loading slightly before visible
      );
      observer.observe(section);
    } else {
      // Fallback: load after short delay
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => initGSAP(), { timeout: 1000 });
      } else {
        setTimeout(initGSAP, 50);
      }
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [direction]);

  /**
   * Effect hook to initialize scroll animations when component mounts or props change
   * Handles cleanup to prevent memory leaks and animation conflicts
   * Optimized for mobile performance
   */
  useEffect(() => {
    // Early return for SSR or missing children
    if (!children || typeof window === "undefined") return;

    // Snap direction uses native CSS scroll-snap, no GSAP needed
    if (direction === "snap") return;

    // Wait for GSAP to load
    if (!gsapLoaded || !animate || !ScrollTrigger) return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const items = wrapper?.querySelectorAll(`.${classesName.item}`);

    // Ensure all required elements exist
    if (!section || !wrapper || !items || items.length === 0) {
      return;
    }

    // Defer animation initialization to next idle period for better performance
    let idleCallbackId: number | undefined;
    let animationFrame: number | undefined;
    const zoomPreventionHandlers: Array<{ event: string; handler: (e: Event) => void }> = [];

    const initializeAnimations = () => {
      animationFrame = requestAnimationFrame(() => {
        try {
          // Initialize appropriate animation based on configuration
          if (enableScrollSnap) {
            if (direction === "3d") {
              init3DScrollSnap(section, items);
            } else {
              initScrollSnap(section, items, direction);
            }
          } else {
            if (direction === "3d") {
              init3DScroll(section, items, lastCardZoomOut);
            } else {
              initScroll(section, items, direction, lastCardZoomOut);
            }
          }

          // Add zoom prevention when scroll snapping is enabled
          if (enableScrollSnap) {
            const preventZoom = (e: Event) => {
              const touchEvent = e as TouchEvent;
              const wheelEvent = e as WheelEvent;

              // Prevent pinch zoom on touch devices
              if (touchEvent.touches && touchEvent.touches.length > 1) {
                e.preventDefault();
                return;
              }

              // Prevent ctrl/cmd + wheel zoom
              if (wheelEvent.ctrlKey || wheelEvent.metaKey) {
                e.preventDefault();
              }
            };

            // Store handlers for cleanup
            const events = [
              { event: "touchstart", handler: preventZoom },
              { event: "touchmove", handler: preventZoom },
              { event: "wheel", handler: preventZoom },
            ];

            events.forEach(({ event, handler }) => {
              section.addEventListener(event, handler, { passive: false });
              zoomPreventionHandlers.push({ event, handler });
            });

            section.classList.add(classesName.prevent_zoom);
            document.body.classList.add("scroll-snap-active");
          }
        } catch (error) {
        }
      });
    };

    // Use requestIdleCallback for non-blocking initialization
    if ("requestIdleCallback" in window) {
      idleCallbackId = requestIdleCallback(initializeAnimations, { timeout: 500 });
    } else {
      initializeAnimations();
    }

    // Cleanup function - ensures proper resource cleanup
    return () => {
      // Cancel pending callbacks
      if (idleCallbackId !== undefined && "cancelIdleCallback" in window) {
        cancelIdleCallback(idleCallbackId);
      }
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }

      // Clean up ScrollTrigger instances
      if (ScrollTrigger) {
        try {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        } catch (error) {}
      }

      // Remove zoom prevention handlers
      if (section && zoomPreventionHandlers.length > 0) {
        zoomPreventionHandlers.forEach(({ event, handler }) => {
          section.removeEventListener(event, handler);
        });
        // Note: zoomPreventionHandlers is scoped to this effect and will be garbage collected
      }

      // Use captured section element to avoid stale closure
      if (section) {
        section.classList.remove(classesName.prevent_zoom);
      }
      if (document.body.classList.contains("scroll-snap-active")) {
        document.body.classList.remove("scroll-snap-active");
      }
    };
  }, [children, direction, lastCardZoomOut, enableScrollSnap, snapType, gsapLoaded, init3DScroll, init3DScrollSnap, initScroll, initScrollSnap]);

  /**
   * Set up scroll listener for 3D animation and device detection
   * Monitors window resize for responsive behavior
   * Optimized with throttling and passive listeners
   */
  useEffect(() => {
    // Immediate initialization for critical data
    checkMobile();
    const cards = React.Children.count(children);
    setTotalCards(cards);

    // Resize handler for responsive behavior (already debounced in useMemo)
    window.addEventListener("resize", checkMobile, { passive: true });

    // Early return if not in 3D mode
    if (typeof window === "undefined" || direction !== "3d") {
      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }

    // Scroll handler for 3D animations (already throttled in useMemo)
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", scrollHandler, { passive: true });

    // Initial scroll calculation
    handleScroll();

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", scrollHandler);
      window.removeEventListener("resize", checkMobile);
    };
  }, [handleScroll, direction, checkMobile, scrollHandler, children]);

  /**
   * Set up scroll listener for snap direction
   * Tracks current card position during scroll
   * Optimized with throttling for better performance
   */
  useEffect(() => {
    if (direction !== "snap") return;

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // handleSnapScroll is already throttled in useMemo
    container.addEventListener("scroll", handleSnapScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleSnapScroll);
    };
  }, [handleSnapScroll, direction]);

  /**
   * Set up keyboard navigation for snap direction
   * Allows arrow keys to navigate between cards
   */
  useEffect(() => {
    if (!enableKeyboardNav || direction !== "snap") return;

    const keyDownHandler = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleKeyDown, enableKeyboardNav, direction]);

  // Early return for empty children
  if (!children) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Cards Scroll - No content"
      >
        <p style={{ color: "#666", fontSize: "1rem" }}>No cards to display</p>
      </div>
    );
  }

  // Render different layouts based on direction
  // Using conditional rendering with Suspense for code splitting
  return (
    <>
      {/* Native CSS scroll-snap layout */}
      {direction === "snap" ? (
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor,
              }}
            />
          }
        >
          <JsxSnapDirectionType
            direction={direction}
            classes={classes}
            classesName={classesName}
            backgroundColor={backgroundColor}
            containerRef={containerRef}
            snapType={snapType}
            enableScrollIndicator={enableScrollIndicator}
            totalCards={totalCards}
            currentCard={currentCard}
            scrollToCard={scrollToCard}
            baseId={baseId}
          >
            {children}
          </JsxSnapDirectionType>
        </Suspense>
      ) : (
        /* GSAP-powered scroll animation layout */
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor,
              }}
            />
          }
        >
          <MainJSX
            classes={classes}
            classesName={classesName}
            backgroundColor={backgroundColor}
            sectionRef={sectionRef}
            wrapperRef={wrapperRef}
            direction={direction}
            enableScrollSnap={enableScrollSnap}
            snapType={snapType}
            baseId={baseId}
          >
            {children}
          </MainJSX>
        </Suspense>
      )}
    </>
  );
};

// Set display name for better debugging
CardsScroll.displayName = "CardsScroll";

// Export both named and default
export default CardsScroll;
