/**
 * Expanding Squares Animation Plugin
 * Creates animated expanding squares with customizable settings
 *
 * Uses unique namespace prefix "salameh-esq-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#08be88",
  backgroundImage: null,
  count: 5,
  color: "#079e71",
  size: 10,
  duration: 12,
  enableBorder: true,
  borderWidth: 1,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-esq-";

// Style sheet ID for tracking
const STYLE_SHEET_ID = `${NAMESPACE_PREFIX}styles`;
const ANIMATION_NAME = `${NAMESPACE_PREFIX}animation`;

// Class names with unique namespace
const CLASS_NAMES = {
  bg: `${NAMESPACE_PREFIX}bg`,
  container: `${NAMESPACE_PREFIX}container`,
  square: `${NAMESPACE_PREFIX}square`,
};

/**
 * Validates and normalizes numeric settings
 * @param {number|string} value - Value to validate
 * @param {number} defaultValue - Default value if invalid
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Validated number
 */
const validateNumber = (value, defaultValue, min = 0, max = Infinity) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num < min || num > max) {
    return defaultValue;
  }
  return num;
};

/**
 * Validates color string
 * @param {string} color - Color value to validate
 * @param {string} defaultValue - Default color if invalid
 * @returns {string} Validated color
 */
const validateColor = (color, defaultValue) => {
  if (typeof color !== "string" || !color.trim()) {
    return defaultValue;
  }
  return color.trim();
};

/**
 * Normalizes settings with validation
 * @param {Object} settings - Settings to normalize
 * @returns {Object} Normalized settings
 */
const normalizeSettings = (settings) => {
  return {
    backgroundColor: validateColor(settings.backgroundColor, defaultSettings.backgroundColor),
    backgroundImage: settings.backgroundImage || null,
    count: Math.max(1, Math.min(50, validateNumber(settings.count, defaultSettings.count, 1, 50))),
    color: validateColor(settings.color, defaultSettings.color),
    size: validateNumber(settings.size, defaultSettings.size, 1, 100),
    duration: validateNumber(settings.duration, defaultSettings.duration, 0.1, 60),
    enableBorder: Boolean(settings.enableBorder !== false),
    borderWidth: validateNumber(settings.borderWidth, defaultSettings.borderWidth, 0, 10),
  };
};

/**
 * Creates CSS keyframes animation if not already present
 */
const injectAnimationStyles = () => {
  if (document.getElementById(STYLE_SHEET_ID)) {
    return; // Styles already injected
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = STYLE_SHEET_ID;
  styleSheet.setAttribute("data-salameh-esq", "styles");
  styleSheet.setAttribute("data-expanding-squares", "true"); // Keep for backward compatibility
  styleSheet.textContent = `
    @keyframes ${ANIMATION_NAME} {
      from {
        transform: scale(0) rotate(0deg) translate(-100%, -50%);
        opacity: 1;
      }
      to {
        transform: scale(10) rotate(360deg) translate(-50%, -50%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);
};

/**
 * Generates random position for squares beyond predefined positions
 * @param {number} index - Square index
 * @returns {Object} Position object with top and left percentages
 */
const getSquarePosition = (index) => {
  const predefinedPositions = [
    { top: "100px", left: "100px", delay: 0 },
    { top: "90%", left: "10%", delay: 2 },
    { top: "10%", left: "50%", delay: 4 },
    { top: "50%", left: "60%", delay: 6 },
    { top: "40%", left: "90%", delay: 8 },
  ];

  if (index < predefinedPositions.length) {
    return predefinedPositions[index];
  }

  // Generate random positions for additional squares
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
  };
};

/**
 * Creates expanding squares HTML structure
 * @param {Object} settings - Normalized settings
 * @returns {HTMLElement} Background container element
 */
const createExpandingSquaresHTML = (settings) => {
  // Create the main container with background
  const bgContainer = document.createElement("div");
  bgContainer.className = CLASS_NAMES.bg;
  bgContainer.setAttribute("aria-hidden", "true");
  bgContainer.setAttribute("role", "presentation");
  bgContainer.setAttribute("data-salameh-esq", "bg-container");

  // Set background style
  let backgroundStyle = `background-color: ${settings.backgroundColor}`;
  if (settings.backgroundImage) {
    backgroundStyle = `background-image: url('${settings.backgroundImage}'); background-position: center center; background-size: cover; background-repeat: no-repeat; background-color: ${settings.backgroundColor}`;
  }

  bgContainer.style.cssText = `
    ${backgroundStyle};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
  `;

  // Create squares container
  const squaresContainer = document.createElement("div");
  squaresContainer.className = CLASS_NAMES.container;
  squaresContainer.setAttribute("aria-hidden", "true");
  squaresContainer.setAttribute("data-salameh-esq", "squares-container");
  squaresContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  `;

  // Create individual squares
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < settings.count; i++) {
    const square = document.createElement("div");
    square.className = CLASS_NAMES.square;
    square.setAttribute("aria-hidden", "true");
    square.setAttribute("data-salameh-esq", "square");
    square.setAttribute("data-salameh-esq-index", String(i));

    const position = getSquarePosition(i);
    const borderStyle = settings.enableBorder ? `border: ${settings.borderWidth}px solid ${settings.color};` : `border: none; background-color: ${settings.color};`;

    square.style.cssText = `
      position: absolute;
      width: ${settings.size}px;
      height: ${settings.size}px;
      ${borderStyle}
      transform-origin: top left;
      transform: scale(0) rotate(0deg) translate(-100%, -50%);
      animation: ${ANIMATION_NAME} ${settings.duration}s ease-in forwards infinite;
      animation-delay: ${position.delay}s;
      top: ${position.top};
      left: ${position.left};
      z-index: 1;
    `;

    fragment.appendChild(square);
  }

  squaresContainer.appendChild(fragment);
  bgContainer.appendChild(squaresContainer);

  return bgContainer;
};

/**
 * Expanding Squares Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function ExpandingSquaresPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    console.error("ExpandingSquaresPlugin: Invalid container element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let htmlStructure = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;

  /**
   * Initializes the expanding squares animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeExpandingSquares = (newSettings = null) => {
    if (!container) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Clean up existing animation - use data attribute for more specific selection
    const existingAnimations = container.querySelectorAll(`[data-salameh-esq="bg-container"]`);
    existingAnimations.forEach((animation) => {
      if (animation.parentNode === container) {
        animation.remove();
      }
    });
    if (htmlStructure && htmlStructure.parentNode === container) {
      htmlStructure.remove();
      htmlStructure = null;
    }

    // Ensure container has required styles
    if (container.style.position !== "relative") {
      container.style.position = "relative";
    }
    if (container.style.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }

    // Inject animation styles
    injectAnimationStyles();

    // Create and inject HTML structure
    htmlStructure = createExpandingSquaresHTML(settings);
    container.appendChild(htmlStructure);
  };

  /**
   * Debounced resize handler
   */
  let resizeTimeout = null;
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (container) {
        initializeExpandingSquares();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeExpandingSquares();
    resizeHandler = handleResize;
    window.addEventListener("resize", resizeHandler, { passive: true });
  };

  /**
   * Cleans up the animation and removes event listeners
   */
  const clean = () => {
    // Remove resize listener
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }

    // Clear resize timeout
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }

    // Remove HTML structure
    if (htmlStructure && htmlStructure.parentNode) {
      try {
        htmlStructure.remove();
      } catch (error) {
        console.warn("ExpandingSquaresPlugin: Error removing HTML structure", error);
      }
      htmlStructure = null;
    }

    // Note: We don't remove the style sheet as it might be used by other instances
    // The style sheet will be cleaned up when the last instance is removed
    // This could be improved with a reference counter if needed

    container = null;
  };

  return {
    start,
    clean,
  };
}
