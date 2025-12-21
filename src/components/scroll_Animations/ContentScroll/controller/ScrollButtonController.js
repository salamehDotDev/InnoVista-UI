/**
 * Scroll Button Controller for Image Scroll Animation
 * Handles scroll button visibility and behavior
 */
export default function ScrollButtonController() {
  const handlers = {
    //===============================================
    /**
     * Handles scroll button visibility based on scroll position.
     * @param {Object} params
     * @param {Function} params.setIsScrollButtonVisible - State setter for button visibility
     * @param {boolean} params.hideOnScroll - Whether to hide button on scroll
     * @returns {Function} - Scroll event handler
     */
    handleScrollButton:
      ({ setIsScrollButtonVisible, hideOnScroll = true }) =>
      () => {
        if (typeof window === "undefined" || !hideOnScroll) return;

        const scrollY = window.scrollY;
        setIsScrollButtonVisible(scrollY === 0);
      },

    //===============================================
    /**
     * Initializes scroll button functionality.
     * @param {Object} params
     * @param {Function} params.setIsScrollButtonVisible - State setter for button visibility
     * @param {boolean} params.hideOnScroll - Whether to hide button on scroll
     * @returns {Function} - Cleanup function to remove event listener
     */
    initScrollButton: ({ setIsScrollButtonVisible, hideOnScroll = true }) => {
      if (typeof window === "undefined" || !hideOnScroll) return;

      const handleScroll = handlers.handleScrollButton({ setIsScrollButtonVisible, hideOnScroll });

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    },

    //===============================================
    /**
     * Gets scroll button configuration based on props.
     * @param {Object} params
     * @param {Object} params.scrollButton - Scroll button props
     * @returns {Object} - Processed scroll button configuration
     */
    getScrollButtonConfig: ({ scrollButton }) => {
      if (!scrollButton) return null;

      return {
        text: scrollButton.text || "scroll",
        showArrow: scrollButton.showArrow !== false,
        hideOnScroll: scrollButton.hideOnScroll !== false,
        style: scrollButton.style || {},
        className: scrollButton.className || "",
      };
    },

    //===============================================
    /**
     * Validates scroll button props.
     * @param {Object} params
     * @param {Object} params.scrollButton - Scroll button props
     * @returns {Object} - Validated scroll button props
     */
    validateScrollButtonProps: ({ scrollButton }) => {
      if (!scrollButton) return null;

      return {
        text: typeof scrollButton.text === "string" ? scrollButton.text : "scroll",
        showArrow: typeof scrollButton.showArrow === "boolean" ? scrollButton.showArrow : true,
        hideOnScroll: typeof scrollButton.hideOnScroll === "boolean" ? scrollButton.hideOnScroll : true,
        style: typeof scrollButton.style === "object" ? scrollButton.style : {},
        className: typeof scrollButton.className === "string" ? scrollButton.className : "",
      };
    },

    //===============================================
    /**
     * Creates scroll button event handlers.
     * @param {Object} params
     * @param {Function} params.setIsScrollButtonVisible - State setter for button visibility
     * @param {Object} params.scrollButton - Scroll button configuration
     * @returns {Object} - Event handlers object
     */
    createScrollButtonHandlers: ({ setIsScrollButtonVisible, scrollButton }) => {
      return {
        handleScroll: handlers.handleScrollButton({
          setIsScrollButtonVisible,
          hideOnScroll: scrollButton?.hideOnScroll,
        }),
        init: () =>
          handlers.initScrollButton({
            setIsScrollButtonVisible,
            hideOnScroll: scrollButton?.hideOnScroll,
          }),
      };
    },

    //===============================================
    /**
     * Checks if scroll button should be visible.
     * @param {Object} params
     * @param {number} params.scrollY - Current scroll position
     * @param {boolean} params.hideOnScroll - Whether to hide on scroll
     * @returns {boolean} - Whether button should be visible
     */
    shouldShowButton: ({ scrollY, hideOnScroll }) => {
      if (!hideOnScroll) return true;
      return scrollY === 0;
    },

    //===============================================
    /**
     * Gets scroll button styles based on theme.
     * @param {Object} params
     * @param {Object} params.theme - Theme object
     * @param {Object} params.scrollButton - Scroll button configuration
     * @returns {Object} - Scroll button styles
     */
    getScrollButtonStyles: ({ theme, scrollButton }) => {
      const config = handlers.getScrollButtonConfig({ scrollButton });
      if (!config) return {};

      return {
        textTransform: "uppercase",
        letterSpacing: "2px",
        fontFamily: theme?.fontSecondary || '"Titillium Web", sans-serif',
        ...config.style,
      };
    },
  };

  return handlers;
}
