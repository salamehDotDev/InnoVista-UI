/**
 * Math Pattern Animation Plugin
 * Creates animated mathematical pattern with customizable colors
 *
 * Uses unique namespace prefix "salameh-mp-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "transparent",
  speed: 0.03,
  gridSize: 30,
  pixelSize: 10,
  centerX: 100,
  centerY: 100,
  baseColor: 192,
  colorVariation: 64,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-mp-";

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
    speed: Math.max(0.001, Math.min(1, validateNumber(settings.speed, defaultSettings.speed, 0.001, 1))),
    gridSize: Math.max(1, Math.min(200, validateNumber(settings.gridSize, defaultSettings.gridSize, 1, 200))),
    pixelSize: Math.max(1, Math.min(100, validateNumber(settings.pixelSize, defaultSettings.pixelSize, 1, 100))),
    centerX: validateNumber(settings.centerX, defaultSettings.centerX, 0, 1000),
    centerY: validateNumber(settings.centerY, defaultSettings.centerY, 0, 1000),
    baseColor: Math.max(0, Math.min(255, validateNumber(settings.baseColor, defaultSettings.baseColor, 0, 255))),
    colorVariation: Math.max(0, Math.min(255, validateNumber(settings.colorVariation, defaultSettings.colorVariation, 0, 255))),
  };
};

/**
 * Math Pattern Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function MathPatternPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let animationId = null;
  let time = 0;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;
  let actualGridSize = 0;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-mp", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Color calculation functions
   */
  const calculateRed = (x, y, time) => {
    return Math.floor(settings.baseColor + settings.colorVariation * Math.cos((x * x - y * y) / 300 + time));
  };

  const calculateGreen = (x, y, time) => {
    return Math.floor(settings.baseColor + settings.colorVariation * Math.sin((x * x * Math.cos(time / 4) + y * y * Math.sin(time / 3)) / 300));
  };

  const calculateBlue = (x, y, time) => {
    return Math.floor(
      settings.baseColor +
        settings.colorVariation *
          Math.sin(5 * Math.sin(time / 9) + ((x - settings.centerX) * (x - settings.centerX) + (y - settings.centerY) * (y - settings.centerY)) / 1100)
    );
  };

  /**
   * Draws a single pixel
   * @param {number} x - X grid coordinate
   * @param {number} y - Y grid coordinate
   * @param {number} r - Red component (0-255)
   * @param {number} g - Green component (0-255)
   * @param {number} b - Blue component (0-255)
   */
  const drawPixel = (x, y, r, g, b) => {
    if (!context) return;

    // Clamp color values to valid range
    const red = Math.max(0, Math.min(255, Math.floor(r)));
    const green = Math.max(0, Math.min(255, Math.floor(g)));
    const blue = Math.max(0, Math.min(255, Math.floor(b)));

    context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    // Ensure pixels overlap to eliminate any gaps and cover the entire canvas
    const pixelWidth = Math.ceil(settings.pixelSize) + 1;
    const pixelHeight = Math.ceil(settings.pixelSize) + 1;
    context.fillRect(x * settings.pixelSize, y * settings.pixelSize, pixelWidth, pixelHeight);
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    // Draw background color
    if (settings.backgroundColor !== "transparent") {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the math pattern animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeMathPattern = (newSettings = null) => {
    if (!canvas) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Get 2D context
    context = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!context) {
      return;
    }

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();

    // Calculate dimensions
    let width = rect.width || 800;
    let height = rect.height || 400;

    // Set canvas dimensions
    screen = {
      width: Math.max(1, Math.floor(width) || rect.width || 800),
      height: Math.max(1, Math.floor(height) || rect.height || 400),
    };

    // Set canvas dimensions (this clears the canvas)
    canvas.width = screen.width;
    canvas.height = screen.height;

    // Set canvas display size (CSS pixels)
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Disable image smoothing to prevent anti-aliasing artifacts
    context.imageSmoothingEnabled = false;

    // Calculate dynamic grid size and pixel size to fill the entire canvas
    if (settings.gridSize === 0) {
      // Auto-calculate grid size based on pixel size
      settings.gridSize = Math.floor(screen.width / settings.pixelSize);
    }

    // Ensure we have at least 1 pixel in the grid
    if (settings.gridSize < 1) {
      settings.gridSize = 1;
    }

    // Recalculate pixel size to fit the canvas perfectly
    settings.pixelSize = screen.width / settings.gridSize;

    // Ensure the pattern covers the entire canvas by extending beyond the grid
    actualGridSize = Math.ceil(screen.width / settings.pixelSize) + 1;

    // Reset time
    time = 0;
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !canvas) return;

    animationId = requestAnimationFrame(render);

    // Draw background first
    drawBackground();

    // Draw the mathematical pattern
    const gridSizeY = Math.ceil(screen.height / settings.pixelSize) + 1;
    for (let x = 0; x <= actualGridSize; x++) {
      for (let y = 0; y <= gridSizeY; y++) {
        const r = calculateRed(x, y, time);
        const g = calculateGreen(x, y, time);
        const b = calculateBlue(x, y, time);
        drawPixel(x, y, r, g, b);
      }
    }

    // Increment time for animation
    time += settings.speed;
  };

  /**
   * Debounced resize handler
   */
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (canvas) {
        // Stop current animation
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        // Reinitialize with current settings
        initializeMathPattern();
        // Restart animation
        render();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeMathPattern();
    render();
    resizeHandler = handleResize;
    window.addEventListener("resize", resizeHandler, { passive: true });
  };

  /**
   * Cleans up the animation and removes event listeners
   */
  const clean = () => {
    // Stop animation
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

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

    // Clear canvas
    if (context && screen) {
      try {
        context.clearRect(0, 0, screen.width, screen.height);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }

    // Clean up references
    context = null;
    canvas = null;
    screen = { width: 0, height: 0 };
    time = 0;
    actualGridSize = 0;
  };

  return {
    start,
    clean,
  };
}
