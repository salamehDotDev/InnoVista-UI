/**
 * Snow Animation Plugin
 * Creates animated snowflakes using canvas
 *
 * Uses unique namespace prefix "salameh-snow-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "transparent",
  backgroundImage: null,
  color: "#ffffff",
  speed: 1,
  size: 3,
  count: 100,
  swaySpeed: 0.5,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-snow-";

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
    backgroundImage: settings.backgroundImage || null,
    color: validateColor(settings.color, defaultSettings.color),
    speed: Math.max(0.1, Math.min(10, validateNumber(settings.speed, defaultSettings.speed, 0.1, 10))),
    size: Math.max(1, Math.min(20, validateNumber(settings.size, defaultSettings.size, 1, 20))),
    count: Math.max(1, Math.min(500, validateNumber(settings.count, defaultSettings.count, 1, 500))),
    swaySpeed: Math.max(0, Math.min(5, validateNumber(settings.swaySpeed, defaultSettings.swaySpeed, 0, 5))),
  };
};

/**
 * Snow Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for rendering
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
function SnowPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    console.error("SnowPlugin: Invalid canvas element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let snowflakes = [];
  let animationId = null;
  let backgroundImage = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-snow", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Creates a snowflake
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {number} size - Snowflake size
   * @returns {Object} Snowflake object
   */
  const createSnowflake = (x, y, size) => {
    const fallSpeed = settings.speed;
    const swaySpeed = settings.swaySpeed || settings.speed * 0.5;
    return {
      x: x,
      y: y,
      size: size,
      fallSpeed: fallSpeed,
      swaySpeed: swaySpeed,
      swayOffset: Math.random() * Math.PI * 2,
      color: settings.color,
    };
  };

  /**
   * Draws a snowflake
   * @param {Object} snowflake - Snowflake object to draw
   */
  const drawSnowflake = (snowflake) => {
    if (!context) return;

    context.fillStyle = snowflake.color;
    context.beginPath();
    context.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
    context.fill();
  };

  /**
   * Updates a snowflake position
   * @param {Object} snowflake - Snowflake object to update
   */
  const updateSnowflake = (snowflake) => {
    snowflake.y += snowflake.fallSpeed;
    snowflake.x += Math.sin(snowflake.swayOffset) * snowflake.swaySpeed;
    snowflake.swayOffset += 0.02;

    // Reset snowflake when it goes off screen
    if (snowflake.y >= screen.height + snowflake.size) {
      snowflake.y = -snowflake.size;
      snowflake.x = Math.floor(Math.random() * screen.width);
    }

    // Keep snowflakes within horizontal bounds
    if (snowflake.x < -snowflake.size) {
      snowflake.x = screen.width + snowflake.size;
    } else if (snowflake.x > screen.width + snowflake.size) {
      snowflake.x = -snowflake.size;
    }

    drawSnowflake(snowflake);
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    // Draw background image if provided
    if (settings.backgroundImage && backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      try {
        // Calculate aspect ratio to fit image properly
        const imgAspect = backgroundImage.width / backgroundImage.height;
        const canvasAspect = screen.width / screen.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawHeight = screen.height;
          drawWidth = backgroundImage.width * (screen.height / backgroundImage.height);
          drawX = (screen.width - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller than canvas
          drawWidth = screen.width;
          drawHeight = backgroundImage.height * (screen.width / backgroundImage.width);
          drawX = 0;
          drawY = (screen.height - drawHeight) / 2;
        }

        context.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
      } catch (error) {
        // Fallback to solid background if image draw fails
        if (settings.backgroundColor !== "transparent") {
          context.fillStyle = settings.backgroundColor;
          context.fillRect(0, 0, screen.width, screen.height);
        }
      }
    } else if (settings.backgroundColor === "transparent") {
      context.clearRect(0, 0, screen.width, screen.height);
    } else {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the snow animation
   */
  const initializeSnow = () => {
    if (!canvas) return;

    context = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!context) {
      console.error("SnowPlugin: Could not get 2D context from canvas");
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

    // Load background image if provided
    if (settings.backgroundImage) {
      if (backgroundImage) {
        // Clean up previous image
        backgroundImage.onload = null;
        backgroundImage.onerror = null;
      }

      backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.onload = function () {
        // Background image loaded successfully, will be drawn in next frame
      };
      backgroundImage.onerror = function () {
        // Background image failed to load, use solid background
        backgroundImage = null;
      };
      backgroundImage.src = settings.backgroundImage;
    } else {
      backgroundImage = null;
    }

    // Initialize snowflakes
    snowflakes = [];
    for (let i = 0; i < settings.count; i++) {
      const x = Math.floor(Math.random() * screen.width);
      const y = Math.floor(Math.random() * screen.height);
      const size = Math.random() * settings.size + 1;
      snowflakes.push(createSnowflake(x, y, size));
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

    // Update and draw all snowflakes
    for (let i = 0; i < snowflakes.length; i++) {
      updateSnowflake(snowflakes[i]);
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
        initializeSnow();
      }
    }, 150);
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeSnow();
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

    // Clean up background image
    if (backgroundImage) {
      backgroundImage.onload = null;
      backgroundImage.onerror = null;
      backgroundImage = null;
    }

    // Clear canvas
    if (context && screen) {
      context.clearRect(0, 0, screen.width, screen.height);
    }

    // Clean up references
    snowflakes = [];
    context = null;
    screen = { width: 0, height: 0 };
  };

  return {
    start,
    clean,
  };
}

export default SnowPlugin;
