/**
 * Rain Animation Plugin
 * Creates animated rain drops using canvas
 *
 * Uses unique namespace prefix "salameh-rain-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "transparent",
  color: "#3b82f6",
  speed: 30,
  rainHeight: 100,
  count: 30,
  width: 1,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-rain-";

// Canvas data attribute
const CANVAS_DATA_ATTR = `${NAMESPACE_PREFIX}canvas`;

/**
 * Validates and normalizes numeric settings
 * @param {number|string} value - Value to validate
 * @param {number} defaultValue - Default value if invalid
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Validated number
 */
const validateNumber = (value, defaultValue, min = -Infinity, max = Infinity) => {
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
    color: validateColor(settings.color, defaultSettings.color),
    speed: Math.max(1, Math.min(100, validateNumber(settings.speed, defaultSettings.speed, 1, 100))),
    rainHeight: Math.max(10, Math.min(500, validateNumber(settings.rainHeight, defaultSettings.rainHeight, 10, 500))),
    count: Math.max(1, Math.min(500, validateNumber(settings.count, defaultSettings.count, 1, 500))),
    width: Math.max(1, Math.min(10, validateNumber(settings.width, defaultSettings.width, 1, 10))),
  };
};

/**
 * Rain Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for rendering
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
function RainPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    console.error("RainPlugin: Invalid canvas element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let rainDrops = [];
  let animationId = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-rain", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Creates a rain drop
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @returns {Object} Rain drop object
   */
  const createRainDrop = (x, y) => {
    return {
      x: x,
      y: y,
      width: settings.width,
      height: settings.rainHeight,
      fallSpeed: settings.speed,
      color: settings.color,
    };
  };

  /**
   * Updates a rain drop position
   * @param {Object} rainDrop - Rain drop object to update
   */
  const updateRainDrop = (rainDrop) => {
    rainDrop.y += rainDrop.fallSpeed;

    // Reset drop when it goes off screen
    if (rainDrop.y >= screen.height) {
      rainDrop.y = -rainDrop.height;
      rainDrop.x = Math.floor(Math.random() * screen.width);
    }

    // Draw the rain drop
    if (context) {
      context.fillStyle = rainDrop.color;
      context.fillRect(rainDrop.x, rainDrop.y, rainDrop.width, rainDrop.height);
    }
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    if (settings.backgroundColor === "transparent") {
      context.clearRect(0, 0, screen.width, screen.height);
    } else {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the rain animation
   */
  const initializeRain = () => {
    if (!canvas) return;

    context = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!context) {
      console.error("RainPlugin: Could not get 2D context from canvas");
      return;
    }

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();
    screen = {
      width: Math.max(1, Math.floor(rect.width) || 800),
      height: Math.max(1, Math.floor(rect.height) || 400),
    };

    // Set canvas dimensions
    canvas.width = screen.width;
    canvas.height = screen.height;

    // Optimize canvas rendering
    context.imageSmoothingEnabled = false;

    // Initialize rain drops
    rainDrops = [];
    for (let i = 0; i < settings.count; i++) {
      const dropX = Math.floor(Math.random() * screen.width);
      const dropY = Math.floor(Math.random() * screen.height);
      rainDrops.push(createRainDrop(dropX, dropY));
    }
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !canvas) return;

    animationId = requestAnimationFrame(render);

    // Draw background first
    drawBackground();

    // Update and draw rain drops
    for (let i = 0; i < rainDrops.length; i++) {
      updateRainDrop(rainDrops[i]);
    }
  };

  /**
   * Debounced resize handler
   */
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (canvas && context) {
        initializeRain();
      }
    }, 150);
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeRain();
    if (context && canvas) {
      render();
    }

    // Setup ResizeObserver for responsive behavior
    if (canvas && window.ResizeObserver) {
      resizeHandler = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === canvas) {
            handleResize();
            break;
          }
        }
      });
      resizeHandler.observe(canvas);
    } else {
      // Fallback to window resize
      window.addEventListener("resize", handleResize, { passive: true });
    }
  };

  /**
   * Cleans up the animation
   */
  const clean = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    // Remove resize observer
    if (resizeHandler) {
      resizeHandler.disconnect();
      resizeHandler = null;
    }

    // Remove window resize listener
    window.removeEventListener("resize", handleResize);

    // Clear resize timeout
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }

    // Clear canvas
    if (context && screen) {
      context.clearRect(0, 0, screen.width, screen.height);
    }

    // Clean up references
    rainDrops = [];
    context = null;
    screen = { width: 0, height: 0 };
  };

  return {
    start,
    clean,
  };
}

export default RainPlugin;
