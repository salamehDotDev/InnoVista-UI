/**
 * Device Controller for Scroll Animation Cards
 * Handles device detection and responsive behavior
 */
export default function DeviceController() {
  const handlers = {
    //===============================================
    /**
     * Checks the current window width and sets the isMobile state accordingly.
     * - width <= 480: considered small mobile
     * - width <= 768: considered tablet
     * - width > 768: considered desktop
     * @param {Function} setIsMobile - React state setter for isMobile
     */
    checkMobile:
      ({ setIsMobile }) =>
      () => {
        const width = window.innerWidth; // Get the current window width

        // If width is 480px or less, treat as small mobile
        if (width <= 480) {
          setIsMobile(true); // Small mobile
          // If width is between 481px and 768px, treat as tablet
        } else if (width <= 768) {
          setIsMobile(true); // Tablet
          // Otherwise, treat as desktop
        } else {
          setIsMobile(false); // Desktop
        }
      },

    //===============================================
    /**
     * Gets the current device type based on window width.
     * @returns {string} - Device type: 'mobile', 'tablet', or 'desktop'
     */
    getDeviceType: () => {
      const width = window.innerWidth;

      if (width <= 480) {
        return "mobile";
      } else if (width <= 768) {
        return "tablet";
      } else {
        return "desktop";
      }
    },

    //===============================================
    /**
     * Checks if the current device is mobile (width <= 768px).
     * @returns {boolean} - True if mobile device
     */
    isMobileDevice: () => {
      return window.innerWidth <= 768;
    },

    //===============================================
    /**
     * Checks if the current device is tablet (width between 481px and 768px).
     * @returns {boolean} - True if tablet device
     */
    isTabletDevice: () => {
      const width = window.innerWidth;
      return width > 480 && width <= 768;
    },

    //===============================================
    /**
     * Checks if the current device is desktop (width > 768px).
     * @returns {boolean} - True if desktop device
     */
    isDesktopDevice: () => {
      return window.innerWidth > 768;
    },

    //===============================================
    /**
     * Gets the appropriate scale value for animations based on device type.
     * @param {boolean} isMobile - Whether the device is mobile
     * @returns {number} - Scale value for animations
     */
    getAnimationScale: (isMobile) => {
      return isMobile ? 0.3 : 0.7;
    },

    //===============================================
    /**
     * Sets up a resize listener to update device state when window size changes.
     * @param {Function} setIsMobile - React state setter for isMobile
     * @returns {Function} - Cleanup function to remove the listener
     */
    setupResizeListener: (setIsMobile) => {
      const handleResize = () => {
        handlers.checkMobile({ setIsMobile })();
      };

      window.addEventListener("resize", handleResize);

      // Return cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
  };

  return handlers;
}
