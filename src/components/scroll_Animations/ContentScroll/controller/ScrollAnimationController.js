/**
 * Scroll Animation Controller for Image Scroll Animation
 * Handles scroll animations, pinning, and intersection observers
 */
export default function ScrollAnimationController() {
  const handlers = {
    //===============================================
    /**
     * Handles scroll animation for a section including pinning logic.
     * @param {Object} params
     * @param {HTMLElement} params.section - Section DOM element
     * @param {HTMLElement} params.pinWrapper - Pin wrapper element
     * @param {HTMLElement} params.textContent - Text content element
     * @param {Object} params.classesName - CSS class names object
     * @param {HTMLElement|Window} params.scrollContainer - The scroll container (window or parent element)
     */
    handleScrollAnimation: ({ section, pinWrapper, textContent, classesName, scrollContainer }) => {
      const rect = section.getBoundingClientRect();
      const isWindowScroll = scrollContainer === window;

      // Get the container bounds
      const container = section.closest(".smd-img-scroll__container");
      const containerRect = container ? container.getBoundingClientRect() : null;

      // For scrollable containers, check if section is in the container's viewport
      let isInViewport;
      if (!isWindowScroll && scrollContainer instanceof HTMLElement) {
        const scrollRect = scrollContainer.getBoundingClientRect();
        isInViewport = rect.top <= scrollRect.top && rect.bottom > scrollRect.top;
      } else {
        isInViewport = rect.top <= 0 && rect.bottom > 0;
      }

      if (isInViewport) {
        // Pin the section
        if (!isWindowScroll && scrollContainer instanceof HTMLElement) {
          // For scrollable containers, calculate the offset from the scroll container
          const scrollRect = scrollContainer.getBoundingClientRect();
          const containerTop = containerRect ? containerRect.top - scrollRect.top : 0;

          // Use sticky-like behavior with absolute positioning
          pinWrapper.style.position = "sticky";
          pinWrapper.style.top = "0";
          pinWrapper.style.left = "0";
          pinWrapper.style.width = "100%";
          pinWrapper.style.height = "100%";
          pinWrapper.style.zIndex = "11";
        } else {
          // For window scroll, use fixed positioning
          pinWrapper.style.position = "fixed";
          pinWrapper.style.top = "0";
          pinWrapper.style.left = containerRect ? `${containerRect.left}px` : "0";
          pinWrapper.style.width = containerRect ? `${containerRect.width}px` : "100%";
          pinWrapper.style.height = "100vh";
          pinWrapper.style.zIndex = "11";
        }

        // IMPORTANT: Don't apply inline styles to text and media containers
        // Let CSS media queries handle all positioning/sizing
        // This prevents JavaScript from overriding responsive styles
      } else {
        // Unpin the section
        pinWrapper.style.position = "relative";
        pinWrapper.style.top = "";
        pinWrapper.style.left = "";
        pinWrapper.style.width = "";
        pinWrapper.style.height = "";
        pinWrapper.style.zIndex = "";

        // PROTECTION: Reset media container and text content to CSS values when unpinned
        const mediaContainerClass = classesName?.media_container || "media-container";
        const mediaContainers = section.querySelectorAll("." + mediaContainerClass);
        mediaContainers.forEach((container) => {
          // Clear any inline styles and let CSS take over
          container.style.cssText = "";
        });

        // Also clear text content inline styles
        if (textContent) {
          textContent.style.top = "";
          textContent.style.left = "";
          textContent.style.transform = "";
          textContent.style.width = "";
          textContent.style.position = "";
        }
      }
    },

    //===============================================
    /**
     * Creates a throttled scroll handler for better performance.
     * @param {Object} params
     * @param {HTMLElement} params.section - Section DOM element
     * @param {HTMLElement} params.pinWrapper - Pin wrapper element
     * @param {HTMLElement} params.textContent - Text content element
     * @param {Object} params.classesName - CSS class names object
     * @param {HTMLElement|Window} params.scrollContainer - The scroll container
     * @returns {Function} - Throttled scroll handler
     */
    createThrottledScrollHandler: ({ section, pinWrapper, textContent, classesName, scrollContainer }) => {
      let ticking = false;

      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handlers.handleScrollAnimation({ section, pinWrapper, textContent, classesName, scrollContainer });
            ticking = false;
          });
          ticking = true;
        }
      };
    },

    //===============================================
    /**
     * Creates an intersection observer for a section.
     * @param {Object} params
     * @param {HTMLElement} params.section - Section DOM element
     * @param {HTMLElement} params.pinWrapper - Pin wrapper element
     * @param {HTMLElement} params.textContent - Text content element
     * @param {Object} params.classesName - CSS class names object
     * @param {HTMLElement|Window} params.scrollContainer - The scroll container
     * @returns {IntersectionObserver} - Intersection observer instance
     */
    createIntersectionObserver: ({ section, pinWrapper, textContent, classesName, scrollContainer }) => {
      const root = scrollContainer === window ? null : scrollContainer;

      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Trigger scroll handler when section comes into view
              handlers.handleScrollAnimation({ section, pinWrapper, textContent, classesName, scrollContainer });
            }
          });
        },
        {
          root: root,
          threshold: [0, 0.5], // OPTIMIZED: Reduced thresholds for better performance
          rootMargin: "50px 0px 50px 0px", // Trigger slightly before/after for smoother experience
        }
      );
    },

    //===============================================
    /**
     * Initializes scroll animations for all sections.
     * OPTIMIZED: Uses a single scroll handler for all sections instead of one per section.
     * Supports both window scroll and scrollable container scroll.
     * @param {Object} params
     * @param {React.ReactNode} params.children - Component children
     * @param {React.RefObject} params.containerRef - Container ref
     * @param {string} params.idStyle - Unique style ID
     * @param {Object} params.classesName - CSS class names object
     * @param {React.RefObject} params.observersRef - Observers ref for cleanup
     * @param {React.RefObject} params.scrollHandlersRef - Scroll handlers ref for cleanup
     * @param {HTMLElement|Window} params.scrollContainer - The scroll container (window or parent element)
     */
    initScrollAnimations: ({ children, containerRef, idStyle, classesName, observersRef, scrollHandlersRef, scrollContainer }) => {
      if (!children || !containerRef.current) return;

      const sectionElements = containerRef.current.querySelectorAll(".smd-img-scroll__section" + idStyle);
      const observers = [];

      // Collect all section data
      const sectionsData = [];
      sectionElements.forEach((section) => {
        const pinWrapperClass = classesName?.pin_wrapper || "pin-wrapper";
        const pinWrapper = section.querySelector("." + pinWrapperClass);
        if (!pinWrapper) return;

        const textContentClass = classesName?.text_content || "text-content";
        const textContent = section.querySelector("." + textContentClass);

        sectionsData.push({ section, pinWrapper, textContent });

        // Create intersection observer for initial trigger
        const observer = handlers.createIntersectionObserver({
          section,
          pinWrapper,
          textContent,
          classesName,
          scrollContainer,
        });

        observer.observe(section);
        observers.push(observer);
      });

      // PERFORMANCE FIX: Single scroll handler for all sections instead of one per section
      let ticking = false;
      const globalScrollHandler = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            sectionsData.forEach(({ section, pinWrapper, textContent }) => {
              handlers.handleScrollAnimation({ section, pinWrapper, textContent, classesName, scrollContainer });
            });
            ticking = false;
          });
          ticking = true;
        }
      };

      // Add single scroll listener to the appropriate scroll container
      if (scrollContainer === window) {
        window.addEventListener("scroll", globalScrollHandler, { passive: true });
      } else {
        scrollContainer.addEventListener("scroll", globalScrollHandler, { passive: true });
      }

      // Store cleanup function
      const cleanupFn = () => {
        if (scrollContainer === window) {
          window.removeEventListener("scroll", globalScrollHandler);
        } else {
          scrollContainer.removeEventListener("scroll", globalScrollHandler);
        }
      };

      observersRef.current = observers;
      scrollHandlersRef.current = [cleanupFn];
    },

    //===============================================
    /**
     * Cleans up scroll animations and observers.
     * @param {Object} params
     * @param {React.RefObject} params.observersRef - Observers ref
     * @param {React.RefObject} params.scrollHandlersRef - Scroll handlers ref
     */
    cleanupScrollAnimations: ({ observersRef, scrollHandlersRef }) => {
      observersRef.current.forEach((observer) => observer.disconnect());
      observersRef.current = [];
      scrollHandlersRef.current.forEach((cleanup) => cleanup());
      scrollHandlersRef.current = [];
    },
  };

  return handlers;
}
