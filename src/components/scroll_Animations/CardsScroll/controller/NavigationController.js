/**
 * Navigation Controller for Scroll Animation Cards
 * Handles user navigation, keyboard events, and scroll-to-card functionality
 */
export default function NavigationController() {
  const handlers = {
    //===============================================
    // This function returns a scroll event handler for snap scrolling.
    // It figures out which card is currently visible based on the scroll position,
    // and updates the current card index in state.
    handleSnapScroll:
      ({ containerRef, direction, setCurrentCard, totalCards }) =>
      () => {
        // Only run if the container exists and direction is "snap"
        if (!containerRef.current || direction !== "snap") return;

        const container = containerRef.current;
        // Get how far the container has been scrolled from the top
        const scrollTop = container.scrollTop;
        // Get the height of one card (assumes all cards are the same height)
        const cardHeight = container.clientHeight;
        // Figure out which card is currently in view
        const currentCardIndex = Math.round(scrollTop / cardHeight);

        // Make sure the index is within bounds and update the state
        setCurrentCard(Math.max(0, Math.min(currentCardIndex, totalCards - 1)));
      },

    //===============================================
    /**
     * Keyboard navigation handler for snap scrolling.
     * Listens for keyboard events (arrow keys, page up/down, home/end) and scrolls to the appropriate card.
     * Only active if keyboard navigation is enabled and direction is "snap".
     *
     * @param {Object} params
     * @param {boolean} params.enableKeyboardNav - Whether keyboard navigation is enabled
     * @param {string} params.direction - The scroll direction ("snap" to enable)
     * @param {Object} params.containerRef - Ref to the scroll container
     * @returns {Function} - Event handler for keydown events
     */
    handleKeyDown:
      ({ enableKeyboardNav, direction, containerRef }) =>
      (event) => {
        // Only handle keyboard navigation if enabled and direction is "snap"
        if (!enableKeyboardNav || direction !== "snap") return;

        const container = containerRef.current;
        if (!container) return;

        // Delegate to the actual key event handler
        handlers.handleKeyDownEvent({ container, event });
      },

    /**
     * Handles the actual keyboard event for snap scrolling.
     * Supports ArrowUp, ArrowDown, PageUp, PageDown, Home, and End keys.
     * Scrolls the container to the appropriate card position smoothly.
     *
     * @param {Object} params
     * @param {HTMLElement} params.container - The scroll container element
     * @param {KeyboardEvent} params.event - The keyboard event
     */
    handleKeyDownEvent: ({ container, event }) => {
      // Height of a single card (assumes all cards are the same height)
      const cardHeight = container.clientHeight;

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          // Scroll down one card, but not past the last card
          event.preventDefault();
          container.scrollTo({
            top: Math.min(container.scrollTop + cardHeight, container.scrollHeight - cardHeight),
            behavior: "smooth",
          });
          break;
        case "ArrowUp":
        case "PageUp":
          // Scroll up one card, but not before the first card
          event.preventDefault();
          container.scrollTo({
            top: Math.max(container.scrollTop - cardHeight, 0),
            behavior: "smooth",
          });
          break;
        case "Home":
          // Scroll to the first card
          event.preventDefault();
          container.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "End":
          // Scroll to the last card
          event.preventDefault();
          container.scrollTo({
            top: container.scrollHeight - cardHeight,
            behavior: "smooth",
          });
          break;
        default:
          // Ignore other keys
          break;
      }
    },

    //===============================================
    /**
     * Scrolls the container to the specified card index in "snap" direction.
     * Used for scroll snapping navigation (e.g., clicking indicator dots).
     *
     * @param {Object} params
     * @param {string} params.direction - The scroll direction ("snap" required)
     * @param {Object} params.containerRef - Ref to the scroll container
     * @returns {Function} - Function to scroll to a given card index
     */
    scrollToCard:
      ({ direction, containerRef }) =>
      (cardIndex) => {
        // Only handle scroll if direction is "snap"
        if (direction !== "snap") return;

        // Get the container element from the ref
        const container = containerRef.current;
        if (!container) return;

        // Calculate the height of a single card (assumes all cards are same height)
        const cardHeight = container.clientHeight;

        // Scroll to the position of the specified card index
        container.scrollTo({
          top: cardIndex * cardHeight,
          behavior: "smooth", // Smooth scrolling animation
        });
      },
  };

  return handlers;
}
