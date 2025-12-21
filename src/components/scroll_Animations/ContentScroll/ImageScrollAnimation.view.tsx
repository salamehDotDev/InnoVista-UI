import React, { useEffect, useRef, useId, ReactNode, useMemo, useCallback } from "react";
import ScrollImageAnimationCtrl from "./controller/ScrollImageAnimation.ctrl";

// CSS styles as a string - injected at runtime to work in packaged builds
const CSS_STYLES = `/* Image Scroll Animation Styles - Package: smd-img-scroll */

/* CSS Variables - Scoped with package prefix to avoid conflicts */
:root {
  --smd-img-scroll-primary: #212121;
  --smd-img-scroll-secondary: #515151;
  --smd-img-scroll-white: #ffffff;
  --smd-img-scroll-spacing: 100px; /* Consistent spacing variable */
}

/* Base container styles - Scoped with unique prefix to avoid conflicts */
.smd-img-scroll__container {
  color: var(--smd-img-scroll-white);
  font-family: sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.3s, background-color 0.3s;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  isolation: isolate; /* Create a new stacking context */
  width: 100%; /* Respect parent container width */
  overflow: hidden; /* Prevent content from breaking out */
}

/* Container section - ensure it has proper height for all sections */
.smd-img-scroll__container > section {
  position: relative;
  width: 100%;
}

/* Selection styles */
.smd-img-scroll__container::selection {
  background: var(--smd-img-scroll-primary);
  color: var(--smd-img-scroll-white);
}

/* Reset styles only for direct children and descendants within the container */
.smd-img-scroll__container > *,
.smd-img-scroll__container .smd-img-scroll__event,
.smd-img-scroll__container .smd-img-scroll__event * {
  box-sizing: border-box;
}

/* Reset margins and padding only for specific elements within the container */
.smd-img-scroll__container .smd-img-scroll__event,
.smd-img-scroll__container .smd-img-scroll__pin-wrapper,
.smd-img-scroll__container .smd-img-scroll__text-content,
.smd-img-scroll__container .smd-img-scroll__media-container {
  margin: 0;
  padding: 0;
}

/* Text content - Equal spacing from left */
.smd-img-scroll__container .smd-img-scroll__text-content {
  top: 50%;
  left: var(--smd-img-scroll-spacing);
  position: absolute;
  transform: translateY(-50%);
  width: calc(43% - var(--smd-img-scroll-spacing));
  max-width: 600px;
  z-index: 10;
  transition: all 0.3s ease;
}

/* Pin wrapper */
.smd-img-scroll__container .smd-img-scroll__pin-wrapper {
  height: 100% !important;
  width: 100% !important;
  position: relative;
  z-index: 11;
  transition: all 0.3s ease !important;
  contain: layout style; /* Optimize rendering performance */
}

/* Event section */
.smd-img-scroll__container .smd-img-scroll__event {
  position: relative;
  overflow: hidden;
  height: 100vh;
  min-height: 500px; /* Ensure minimum height for constrained containers */
  width: 100%;
  z-index: 1;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

/* Ensure sections stack vertically and don't overlap */
.smd-img-scroll__container > section > .smd-img-scroll__event:not(:first-child) {
  margin-top: 0;
}

/* Media container - Equal spacing from right, scales down responsively */
.smd-img-scroll__container .smd-img-scroll__media-container {
  position: absolute !important;
  top: 50% !important;
  right: var(--smd-img-scroll-spacing) !important;
  left: auto !important;
  width: 500px !important;
  height: 500px !important;
  max-width: calc(50% - var(--smd-img-scroll-spacing) * 2);
  max-height: 70vh;
  transform: translateY(-50%) !important;
  border-radius: 12px !important;
  background-size: cover !important;
  background-position: center center !important;
  transition: all 0.3s ease !important;
  box-shadow: 2px 2px 10px 10px rgba(0, 0, 0, 0.12) !important;
  transform-origin: center !important;
  z-index: 8888 !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: stretch !important;
  justify-content: stretch !important;
  will-change: auto !important;
  backface-visibility: hidden !important;
}

/* Ensure images fill the entire media container */
.smd-img-scroll__container .smd-img-scroll__media-container img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  border-radius: 12px !important;
  display: block !important;
}

/* Ensure videos fill the entire media container - stretch to fill all space */
.smd-img-scroll__container .smd-img-scroll__media-container video {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  border-radius: 12px !important;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Ensure video source elements don't interfere */
.smd-img-scroll__container .smd-img-scroll__media-container video source {
  display: none;
}

/* Text styles within container */
.smd-img-scroll__container .smd-img-scroll__text-content h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.smd-img-scroll__container .smd-img-scroll__text-content p {
  font-size: 45px;
  line-height: 1.4;
  font-weight: 200;
  margin: 0;
}

/* No content */
.smd-img-scroll__container .smd-img-scroll__no-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  color: var(--smd-img-scroll-white);
}

.smd-img-scroll__container .smd-img-scroll__no-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.smd-img-scroll__container .smd-img-scroll__no-content p {
  font-size: 1.2rem;
  color: var(--smd-img-scroll-secondary);
}

/* Overflow hidden - This is applied to body/html by JavaScript, so keep it global but more specific */
body.overflow-hidden,
html.overflow-hidden {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
}

/* Section overlay */
.section-overlay {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* Preloader */
.preloader {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: var(--smd-img-scroll-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;
}

/* Text wrapper */
.text-wrapper {
  text-align: center;
  height: 24px;
  overflow: hidden;
  transition: opacity 1s;
}

.first-text {
  opacity: 1;
  margin: 0;
}

.second-text {
  opacity: 0;
  transform: translateY(-30px);
  margin: 0;
}

/* Scroll arrow - removed, no longer used */
@keyframes scroll-animate {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-10px, -10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(10px, 10px);
  }
}

/* Responsive Breakpoints */

/* Extra Large (xl) - 1400px and up */
@media (min-width: 1400px) {
  :root {
    --smd-img-scroll-spacing: 120px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 26px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 48px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    left: var(--smd-img-scroll-spacing);
    width: calc(43% - var(--smd-img-scroll-spacing));
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 550px !important;
    height: 550px !important;
    right: var(--smd-img-scroll-spacing) !important;
  }
}

/* Large (xl) - 1280px to 1399px */
@media (min-width: 1280px) and (max-width: 1399px) {
  :root {
    --smd-img-scroll-spacing: 100px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 22px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 38px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    left: var(--smd-img-scroll-spacing);
    width: calc(43% - var(--smd-img-scroll-spacing));
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 500px !important;
    height: 500px !important;
    right: var(--smd-img-scroll-spacing) !important;
  }
}

/* Large (lg) - 1024px to 1279px - Side by side layout */
@media (min-width: 1024px) and (max-width: 1279px) {
  :root {
    --smd-img-scroll-spacing: 60px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 20px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 34px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    left: var(--smd-img-scroll-spacing);
    width: calc(44% - var(--smd-img-scroll-spacing));
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 380px !important;
    height: 380px !important;
    right: var(--smd-img-scroll-spacing) !important;
  }
}

/* Medium (md) - 900px to 1023px - Side by side layout */
@media (min-width: 900px) and (max-width: 1023px) {
  :root {
    --smd-img-scroll-spacing: 40px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 18px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 28px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    left: var(--smd-img-scroll-spacing);
    width: calc(46% - var(--smd-img-scroll-spacing));
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 300px !important;
    height: 300px !important;
    right: var(--smd-img-scroll-spacing) !important;
  }
}

/* Small (sm) - 800px to 899px - Stack image above text, centered */
@media (min-width: 800px) and (max-width: 899px) {
  :root {
    --smd-img-scroll-spacing: 40px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 26px;
    line-height: 1.4;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    width: calc(100% - var(--smd-img-scroll-spacing) * 2) !important;
    left: 50% !important;
    right: auto !important;
    top: 60% !important;
    transform: translate(-50%, -50%) !important;
    text-align: center;
  }

  .smd-img-scroll__container .smd-img-scroll__section-1 .smd-img-scroll__text-content {
    top: 64% !important;
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 320px !important;
    height: 320px !important;
    top: 16% !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    max-width: calc(100% - var(--smd-img-scroll-spacing) * 2);
  }
}

/* Small (sm) - 768px to 799px - Stack image above text, centered */
@media (min-width: 768px) and (max-width: 799px) {
  :root {
    --smd-img-scroll-spacing: 40px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 26px;
    line-height: 1.4;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    width: calc(100% - var(--smd-img-scroll-spacing) * 2) !important;
    left: 50% !important;
    right: auto !important;
    top: 60% !important;
    transform: translate(-50%, -50%) !important;
    text-align: center;
  }

  .smd-img-scroll__container .smd-img-scroll__section-1 .smd-img-scroll__text-content {
    top: 64% !important;
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 300px !important;
    height: 300px !important;
    top: 16% !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    max-width: calc(100% - var(--smd-img-scroll-spacing) * 2);
  }
}

/* Small (sm) - 640px to 767px - Stack image above text on mobile */
@media (min-width: 640px) and (max-width: 767px) {
  :root {
    --smd-img-scroll-spacing: 30px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 24px;
    line-height: 1.4;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    width: calc(100% - var(--smd-img-scroll-spacing) * 2) !important;
    left: var(--smd-img-scroll-spacing) !important;
    right: var(--smd-img-scroll-spacing) !important;
    top: 62% !important;
    transform: translateY(-50%) !important;
    text-align: center;
  }

  .smd-img-scroll__container .smd-img-scroll__section-1 .smd-img-scroll__text-content {
    top: 65% !important;
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 280px !important;
    height: 280px !important;
    top: 15% !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    max-width: calc(100% - var(--smd-img-scroll-spacing) * 2);
  }
}

/* Extra Small (xs) - below 640px - Stack image above text on mobile */
@media (max-width: 639px) {
  :root {
    --smd-img-scroll-spacing: 24px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 18px !important;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 20px !important;
    line-height: 1.4;
    margin-bottom: 10px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    width: calc(100% - var(--smd-img-scroll-spacing) * 2) !important;
    top: 64% !important;
    left: var(--smd-img-scroll-spacing) !important;
    right: var(--smd-img-scroll-spacing) !important;
    transform: translateY(-50%) !important;
    text-align: center;
    padding: 0;
  }

  .smd-img-scroll__container .smd-img-scroll__section-1 .smd-img-scroll__text-content {
    top: 66% !important;
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 240px !important;
    height: 240px !important;
    top: 12% !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    max-width: calc(100% - var(--smd-img-scroll-spacing) * 2);
  }
}

/* Very Small (xxs) - below 480px - Stack image above text on mobile */
@media (max-width: 479px) {
  :root {
    --smd-img-scroll-spacing: 20px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content h2 {
    font-size: 16px !important;
    margin-bottom: 10px;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content p {
    font-size: 18px !important;
    line-height: 1.35;
  }

  .smd-img-scroll__container .smd-img-scroll__text-content {
    width: calc(100% - var(--smd-img-scroll-spacing) * 2) !important;
    top: 64% !important;
    left: var(--smd-img-scroll-spacing) !important;
    right: var(--smd-img-scroll-spacing) !important;
    transform: translateY(-50%) !important;
    text-align: center;
  }

  .smd-img-scroll__container .smd-img-scroll__section-1 .smd-img-scroll__text-content {
    top: 66% !important;
  }

  .smd-img-scroll__container .smd-img-scroll__media-container {
    width: 200px !important;
    height: 200px !important;
    top: 10% !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    max-width: calc(100% - var(--smd-img-scroll-spacing) * 2);
  }
}`;

// Inject CSS styles into the document head
const injectStyles = () => {
  if (typeof document === "undefined") return;

  const styleId = "smd-img-scroll-styles";
  // Check if styles are already injected
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = CSS_STYLES;
  document.head.appendChild(style);
};

// Package prefix for unique class naming to avoid conflicts
const PKG_PREFIX = "smd-img-scroll";

// Type definitions
interface ThemeConfig {
  primary?: string;
  white?: string;
  fontPrimary?: string;
  fontSecondary?: string;
}

interface ContentScrollProps {
  children: ReactNode;
  theme?: ThemeConfig;
}

interface ClassNames {
  readonly container: string;
  readonly pin_wrapper: string;
  readonly media_container: string;
  readonly text_content: string;
  readonly no_content: string;
  readonly event: string;
  readonly section_1: string;
  readonly section_2: string;
  readonly section_3: string;
  readonly section_4: string;
  readonly overflow_hidden: string;
  readonly section_overlay: string;
  readonly preloader: string;
  readonly text_wrapper: string;
  readonly first_text: string;
  readonly second_text: string;
}

interface ProcessedSection {
  key: string;
  id: string;
  className: string;
  style: React.CSSProperties;
  sectionInfo: ReactNode | null;
  mediaContent: ReactNode | null;
}

interface ThemeStyles {
  primary: string;
  white: string;
  fontPrimary: string;
  fontSecondary: string;
}

/**
 * ContentScroll - A performant scroll-based animation component
 * Displays content sections with parallax-like effects as user scrolls
 *
 * @component
 * @example
 * ```tsx
 * <ContentScroll theme={{ primary: "#1a1a2e", white: "#ffffff" }}>
 *   <div style={{ backgroundImage: "url(...)" }}>
 *     <h2>Section Title</h2>
 *     <p>Section description</p>
 *     <video src="..." />
 *   </div>
 * </ContentScroll>
 * ```
 */
export function ContentScroll({ children, theme = {} }: ContentScrollProps) {
  // Memoized class names with unique package prefix to avoid conflicts
  const classesName: ClassNames = useMemo(
    () => ({
      container: `${PKG_PREFIX}__container`,
      pin_wrapper: `${PKG_PREFIX}__pin-wrapper`,
      media_container: `${PKG_PREFIX}__media-container`,
      text_content: `${PKG_PREFIX}__text-content`,
      no_content: `${PKG_PREFIX}__no-content`,
      event: `${PKG_PREFIX}__event`,
      section_1: `${PKG_PREFIX}__section-1`,
      section_2: `${PKG_PREFIX}__section-2`,
      section_3: `${PKG_PREFIX}__section-3`,
      section_4: `${PKG_PREFIX}__section-4`,
      overflow_hidden: `${PKG_PREFIX}__overflow-hidden`,
      section_overlay: `${PKG_PREFIX}__section-overlay`,
      preloader: `${PKG_PREFIX}__preloader`,
      text_wrapper: `${PKG_PREFIX}__text-wrapper`,
      first_text: `${PKG_PREFIX}__first-text`,
      second_text: `${PKG_PREFIX}__second-text`,
    }),
    []
  );

  // Generate unique IDs for this component instance
  const id1 = useId();
  const id2 = useId();
  const idStyle = useMemo(() => String(id1).replace(/:/g, ""), [id1]);
  const baseId = useMemo(() => String(id2).replace(/:/g, ""), [id2]);

  // Refs for DOM elements and lifecycle management
  const containerRef = useRef<HTMLElement>(null);
  const observersRef = useRef<IntersectionObserver[]>([]);
  const scrollHandlersRef = useRef<(() => void)[]>([]);
  const scrollContainerRef = useRef<HTMLElement | Window | null>(null);

  // Initialize controllers
  const handlers = useMemo(() => ScrollImageAnimationCtrl(), []);
  const { buildThemeStyles, processChildren, initScrollAnimations } = handlers;

  // Memoize theme styles to prevent unnecessary recalculations
  const themeStyles: ThemeStyles = useMemo(() => buildThemeStyles({ theme }) as ThemeStyles, [theme, buildThemeStyles]);

  // Memoize processed sections
  const sections: ProcessedSection[] = useMemo(() => processChildren({ children, baseId }), [children, baseId, processChildren]);

  // Calculate total height needed for all sections
  // Note: This will be adjusted dynamically in useEffect for constrained containers
  const totalHeight = useMemo(() => `${sections.length * 100}vh`, [sections.length]);

  // Cleanup function memoized to prevent recreating on every render
  const cleanup = useCallback(() => {
    observersRef.current.forEach((observer) => observer?.disconnect());
    observersRef.current = [];
    scrollHandlersRef.current.forEach((cleanupFn) => cleanupFn?.());
    scrollHandlersRef.current = [];
  }, []);

  /**
   * Inject CSS styles on mount
   */
  useEffect(() => {
    injectStyles();
  }, []);

  /**
   * Initialize scroll animations on mount
   * Cleanup on unmount to prevent memory leaks
   */
  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined" || !containerRef.current) return;

    // Detect scroll container (parent with overflow-auto/scroll or window)
    const detectScrollContainer = () => {
      let element = containerRef.current?.parentElement;
      while (element) {
        const style = window.getComputedStyle(element);
        const overflow = style.overflow + style.overflowY + style.overflowX;
        if (overflow.includes("auto") || overflow.includes("scroll")) {
          return element;
        }
        element = element.parentElement;
      }
      return window;
    };

    const scrollContainer = detectScrollContainer();
    scrollContainerRef.current = scrollContainer;

    // Adapt section heights based on scroll container
    const sectionElements = containerRef.current.querySelectorAll(`.${PKG_PREFIX}__section${idStyle}`);
    if (scrollContainer !== window && scrollContainer instanceof HTMLElement) {
      const containerHeight = scrollContainer.clientHeight;

      // Update each section height
      sectionElements.forEach((section) => {
        (section as HTMLElement).style.height = `${containerHeight}px`;
        (section as HTMLElement).style.minHeight = `${containerHeight}px`;
      });

      // Update total container height
      const mainSection = containerRef.current.parentElement;
      if (mainSection) {
        mainSection.style.height = `${containerHeight * sections.length}px`;
      }
    }

    // Initialize scroll animations
    try {
      initScrollAnimations({
        children,
        containerRef,
        idStyle,
        classesName,
        observersRef,
        scrollHandlersRef,
        scrollContainer,
      });
    } catch (error) {
      console.error("[ContentScroll] Failed to initialize scroll animations:", error);
    }

    // Cleanup on unmount
    return cleanup;
  }, [children, idStyle, classesName, initScrollAnimations, cleanup]);

  // Early return for no content
  if (!children) {
    return (
      <div className={classesName.container} role="region" aria-label="Image Scroll Animation">
        <div className={classesName.no_content}>
          <h1>No sections provided</h1>
          <p>Please provide children components to display the animation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classesName.container} style={{ backgroundColor: themeStyles.primary }} role="region" aria-label="Image Scroll Animation">
      <section ref={containerRef} style={{ height: totalHeight }}>
        {sections.map((section, index) => {
          const sectionNumber = index + 1;
          const sectionClassKey = `section_${sectionNumber}` as keyof ClassNames;

          return (
            <div
              key={section.key}
              id={section.id}
              className={`${PKG_PREFIX}__section${idStyle} ${classesName.event} ${classesName[sectionClassKey] || ""} ${section.className || ""}`.trim()}
              style={section.style}
              aria-label={`Section ${sectionNumber}`}
            >
              <div className={classesName.pin_wrapper}>
                {/* Text Content */}
                <div className={classesName.text_content}>
                  {section.sectionInfo &&
                    React.isValidElement(section.sectionInfo) &&
                    React.cloneElement(section.sectionInfo, {
                      style: {
                        color: themeStyles.white,
                        fontFamily: themeStyles.fontPrimary,
                      },
                    } as React.HTMLAttributes<HTMLElement>)}
                </div>

                {/* Media Container */}
                <div className={classesName.media_container}>
                  {section.mediaContent && React.isValidElement(section.mediaContent) && React.cloneElement(section.mediaContent)}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
