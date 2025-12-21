/**
 * Scroll Progress Controller for Scroll Animation Cards
 * Handles scroll progress calculation and scroll event management
 */
export default function ScrollProgressController() {
  const handlers = {
    //===============================================
    /**
     * Calculates the scroll progress for a 3D scroll animation section.
     * Returns a value between 0 and 1 representing how much the section has been scrolled through.
     * Only works when direction is "3d".
     *
     * @param {Object} params
     * @param {Object} params.sectionRef - React ref to the section DOM element
     * @param {string} params.direction - Animation direction ("3d" to enable)
     * @returns {Function} - Function that returns the current scroll progress (0-1)
     */
    calculateScrollProgress:
      ({ sectionRef, direction }) =>
      () => {
        // If the section ref is not set or direction is not "3d", return 0 progress
        if (!sectionRef.current || direction !== "3d") return 0;

        const section = sectionRef.current;
        const sectionHeight = section.offsetHeight; // Height of the section
        const windowHeight = window.innerHeight; // Height of the viewport
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Current scroll position

        // Get the top and bottom position of the section relative to the document
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + sectionHeight;
        // Calculate the bottom position of the viewport
        const scrollBottom = scrollTop + windowHeight;

        // If the section is not visible in the viewport at all, return 0 progress
        if (scrollBottom < sectionTop || scrollTop > sectionBottom) {
          return 0;
        }

        // Total distance over which the scroll animation should occur
        const totalScrollDistance = sectionHeight + windowHeight;
        // How far the viewport's bottom is past the section's top
        const currentScrollDistance = scrollBottom - sectionTop;

        // Calculate raw progress (clamped between 0 and 1)
        let progress = Math.max(0, Math.min(1, currentScrollDistance / totalScrollDistance));

        // Apply an aggressive easing function to make the animation more responsive to scroll
        // Raising to the power of 0.2 makes the progress ramp up quickly at the start
        progress = Math.pow(progress, 0.2);

        return progress;
      },

    //===============================================
    /**
     * Handles scroll events and updates scroll progress for 3D animations.
     * Only processes scroll events when direction is "3d".
     *
     * @param {Object} params
     * @param {string} params.direction - Animation direction ("3d" to enable)
     * @param {Function} params.setScrollProgress - React state setter for scroll progress
     * @param {Object} params.sectionRef - React ref to the section DOM element
     * @returns {Function} - Scroll event handler
     */
    handleScroll:
      ({ direction, sectionRef }) =>
      () => {
        if (direction === "3d") {
          const progress = handlers.calculateScrollProgress({ sectionRef, direction });
          return progress;
        }
      },

    //===============================================
    /**
     * Updates scroll progress by calling the handleScroll function.
     * This is a wrapper function that can be used for scroll event listeners.
     *
     * @param {Object} params
     * @param {string} params.direction - Animation direction
     * @param {Object} params.sectionRef - React ref to the section DOM element
     * @returns {Function} - Update scroll function
     */
    updateScroll:
      ({ direction, sectionRef }) =>
      () => {
        const handleScroll = handlers.handleScroll({ direction, sectionRef });
        handleScroll();
      },

    //===============================================
    /**
     * Scroll handler that uses requestAnimationFrame for optimal performance.
     * This is the recommended way to handle scroll events for smooth animations.
     *
     * @param {Object} params
     * @param {string} params.direction - Animation direction
     * @param {Object} params.sectionRef - React ref to the section DOM element
     * @returns {Function} - Optimized scroll handler
     */
    scrollHandler:
      ({ direction, sectionRef }) =>
      () => {
        const updateScroll = handlers.updateScroll({ direction, sectionRef });
        requestAnimationFrame(updateScroll);
      },
  };

  return handlers;
}
