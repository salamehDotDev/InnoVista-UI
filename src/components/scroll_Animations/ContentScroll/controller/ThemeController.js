/**
 * Theme Controller for Image Scroll Animation
 * Handles theme management and styling utilities
 */
export default function ThemeController() {
  const handlers = {
    //===============================================
    /**
     * Builds theme styles by merging default theme with user-provided theme.
     * @param {Object} params
     * @param {Object} params.theme - User-provided theme object
     * @returns {Object} - Merged theme object with default values
     */
    buildThemeStyles: ({ theme }) => {
      const defaultTheme = {
        primary: "#212121",
        secondary: "#515151",
        white: "#ffffff",
        fontPrimary: '"Poppins", sans-serif',
        fontSecondary: '"Titillium Web", sans-serif',
      };

      return { ...defaultTheme, ...theme };
    },

    //===============================================
    /**
     * Ensures media elements have proper styling for the scroll animation.
     * @param {Object} params
     * @param {React.Element} params.mediaElement - Media element to style
     * @returns {React.Element} - Styled media element
     */
    ensureMediaStyling: ({ mediaElement }) => {
      if (!mediaElement) return mediaElement;

      const userStyle = mediaElement.props?.style || {};
      const userWidth = userStyle.width;
      const userHeight = userStyle.height;

      // Take full height of the container
      const mediaStyle = {
        // Use user dimensions if specified, otherwise fill container
        ...(userWidth ? {} : { width: "100%" }),
        ...(userHeight ? {} : { height: "100%" }),
        // Take full height - maintain aspect ratio, may crop width
        objectFit: "cover",
        objectPosition: "center center",
        // Preserve any user-specified styles
        ...userStyle,
      };

      return React.cloneElement(mediaElement, { style: mediaStyle });
    },

    //===============================================
    /**
     * Gets default theme values.
     * @returns {Object} - Default theme object
     */
    getDefaultTheme: () => {
      return {
        primary: "#212121",
        secondary: "#515151",
        white: "#ffffff",
        fontPrimary: '"Poppins", sans-serif',
        fontSecondary: '"Titillium Web", sans-serif',
      };
    },

    //===============================================
    /**
     * Validates theme object and returns sanitized theme.
     * @param {Object} params
     * @param {Object} params.theme - Theme object to validate
     * @returns {Object} - Validated and sanitized theme
     */
    validateTheme: ({ theme }) => {
      const defaultTheme = handlers.getDefaultTheme();
      const validKeys = Object.keys(defaultTheme);

      const sanitizedTheme = {};
      Object.keys(theme || {}).forEach((key) => {
        if (validKeys.includes(key) && theme[key]) {
          sanitizedTheme[key] = theme[key];
        }
      });

      return { ...defaultTheme, ...sanitizedTheme };
    },
  };

  return handlers;
}
