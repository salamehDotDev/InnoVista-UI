/**
 * Floating Squares Animation Plugin
 * Creates animated floating squares with customizable settings
 *
 * Uses unique namespace prefix "salameh-fsq-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#4e54c8",
  backgroundImage: null,
  count: 10,
  color: "rgba(255, 255, 255, 0.2)",
  duration: 25,
  enableGradient: false,
  gradientColor1: "#8f94fb",
  gradientColor2: "#4e54c8",
  gradientDirection: "to left",
  enableRandomSizes: false,
  enableRandomDelays: false,
  enableRandomPositions: false,
  speed: 1,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-fsq-";

// Style sheet ID for tracking
const STYLE_SHEET_ID = `${NAMESPACE_PREFIX}styles`;
const ANIMATION_NAME = `${NAMESPACE_PREFIX}animate`;

// Class names with unique namespace
const CLASS_NAMES = {
  container: `${NAMESPACE_PREFIX}container`,
  squaresContainer: `${NAMESPACE_PREFIX}squares-container`,
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
    count: Math.max(1, Math.min(100, validateNumber(settings.count, defaultSettings.count, 1, 100))),
    color: validateColor(settings.color, defaultSettings.color),
    duration: validateNumber(settings.duration, defaultSettings.duration, 1, 120),
    enableGradient: Boolean(settings.enableGradient === true),
    gradientColor1: validateColor(settings.gradientColor1, defaultSettings.gradientColor1),
    gradientColor2: validateColor(settings.gradientColor2, defaultSettings.gradientColor2),
    gradientDirection: typeof settings.gradientDirection === "string" ? settings.gradientDirection : defaultSettings.gradientDirection,
    enableRandomSizes: Boolean(settings.enableRandomSizes === true),
    enableRandomDelays: Boolean(settings.enableRandomDelays === true),
    enableRandomPositions: Boolean(settings.enableRandomPositions === true),
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
  };
};

/**
 * Creates CSS animation styles if not already present
 */
const injectAnimationStyles = () => {
  if (document.getElementById(STYLE_SHEET_ID)) {
    return; // Styles already injected
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = STYLE_SHEET_ID;
  styleSheet.setAttribute("data-salameh-fsq", "styles");
  styleSheet.textContent = `
    @keyframes ${ANIMATION_NAME} {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
      }
      100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
      }
    }

    .${CLASS_NAMES.container} {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .${CLASS_NAMES.squaresContainer} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin: 0;
      padding: 0;
      list-style: none;
      pointer-events: none;
    }

    .${CLASS_NAMES.square} {
      position: absolute;
      display: block;
      list-style: none;
      bottom: -150px;
    }
  `;
  document.head.appendChild(styleSheet);
};

/**
 * Floating Squares Animation Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function FloatingSquaresPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let squaresContainer = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Random number generator
  const randomNumFrom = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  /**
   * Creates the background style string
   * @returns {string} CSS background style
   */
  const createBackgroundStyle = () => {
    if (settings.backgroundImage) {
      return `background-image: url(${settings.backgroundImage}); background-size: cover; background-position: center; background-color: ${settings.backgroundColor};`;
    } else if (settings.enableGradient && settings.gradientColor1 && settings.gradientColor2) {
      return `background: -webkit-linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}); background: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}); background-color: ${settings.backgroundColor};`;
    } else {
      return `background: ${settings.backgroundColor};`;
    }
  };

  /**
   * Gets square properties for a specific index
   * @param {number} index - Square index
   * @returns {Object} Square properties (left, width, height, delay, duration)
   */
  const getSquareProperties = (index) => {
    // Predefined positions for first 10 squares (original behavior)
    const predefinedSquares = [
      { left: 25, width: 80, height: 80, delay: 0, duration: null },
      { left: 10, width: 20, height: 20, delay: 2, duration: 12 },
      { left: 70, width: 20, height: 20, delay: 4, duration: null },
      { left: 40, width: 60, height: 60, delay: 0, duration: 18 },
      { left: 65, width: 20, height: 20, delay: 0, duration: null },
      { left: 75, width: 110, height: 110, delay: 3, duration: null },
      { left: 35, width: 150, height: 150, delay: 7, duration: null },
      { left: 50, width: 25, height: 25, delay: 15, duration: 45 },
      { left: 20, width: 15, height: 15, delay: 2, duration: 35 },
      { left: 85, width: 150, height: 150, delay: 0, duration: 11 },
    ];

    if (index < predefinedSquares.length && !settings.enableRandomPositions && !settings.enableRandomSizes && !settings.enableRandomDelays) {
      return predefinedSquares[index];
    }

    // Use random values if enabled
    const leftPos = settings.enableRandomPositions ? randomNumFrom(0, 100) : index < predefinedSquares.length ? predefinedSquares[index].left : 50;
    const size = settings.enableRandomSizes ? randomNumFrom(20, 150) : index < predefinedSquares.length ? predefinedSquares[index].width : 50;
    const delay = settings.enableRandomDelays ? randomNumFrom(0, 5) : index < predefinedSquares.length ? predefinedSquares[index].delay : 0;
    const duration = index < predefinedSquares.length && predefinedSquares[index].duration ? predefinedSquares[index].duration : null;

    return {
      left: leftPos,
      width: size,
      height: size,
      delay: delay,
      duration: duration,
    };
  };

  /**
   * Creates a single square element
   * @param {number} index - Square index
   * @returns {HTMLElement} Square element
   */
  const createSquareElement = (index) => {
    const square = document.createElement("li");
    square.className = CLASS_NAMES.square;
    square.setAttribute("data-salameh-fsq", "square");
    square.setAttribute("data-salameh-fsq-index", index.toString());
    square.setAttribute("aria-hidden", "true");
    square.setAttribute("role", "presentation");

    const props = getSquareProperties(index);
    const speedMultiplier = settings.speed || 1;
    const baseDuration = settings.duration || 25;
    const animationDuration = props.duration ? props.duration / speedMultiplier : baseDuration / speedMultiplier;

    square.style.cssText = `
      left: ${props.left}%;
      width: ${props.width}px;
      height: ${props.height}px;
      background: ${settings.color};
      animation: ${ANIMATION_NAME} ${animationDuration}s linear infinite;
      animation-delay: ${props.delay}s;
    `;

    return square;
  };

  /**
   * Initializes the floating squares animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeFloatingSquares = (newSettings = null) => {
    if (!container) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Clean up existing elements
    const existingContainer = container.querySelector(`.${CLASS_NAMES.container}`);
    if (existingContainer && existingContainer.parentNode === container) {
      existingContainer.remove();
    }

    // Inject animation styles
    injectAnimationStyles();

    // Create main container
    const areaContainer = document.createElement("div");
    areaContainer.className = CLASS_NAMES.container;
    areaContainer.setAttribute("data-salameh-fsq", "container");
    areaContainer.style.cssText = `
      ${createBackgroundStyle()}
      width: 100%;
      height: 100%;
      position: relative;
    `;

    // Create squares container
    squaresContainer = document.createElement("ul");
    squaresContainer.className = CLASS_NAMES.squaresContainer;
    squaresContainer.setAttribute("data-salameh-fsq", "squares-container");
    squaresContainer.setAttribute("aria-hidden", "true");
    squaresContainer.setAttribute("role", "presentation");

    // Create squares
    for (let i = 0; i < settings.count; i++) {
      const square = createSquareElement(i);
      squaresContainer.appendChild(square);
    }

    areaContainer.appendChild(squaresContainer);
    container.appendChild(areaContainer);
  };

  /**
   * Debounced resize handler
   */
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (container) {
        initializeFloatingSquares();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeFloatingSquares();
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

    // Remove container
    if (container) {
      try {
        const existingContainer = container.querySelector(`.${CLASS_NAMES.container}`);
        if (existingContainer && existingContainer.parentNode === container) {
          existingContainer.remove();
        }
      } catch (error) {
      }
    }

    // Remove styles (only if no other instances exist)
    // Note: We keep styles in case multiple instances exist
    // In a production environment, you might want to track instance count
    try {
      const styleSheet = document.getElementById(STYLE_SHEET_ID);
      // Only remove if we're sure no other instances exist
      // For now, we'll leave it to avoid breaking other instances
    } catch (error) {
    }

    // Clean up references
    squaresContainer = null;
    container = null;
  };

  return {
    start,
    clean,
  };
}
