/**
 * Water Drops Animation Plugin
 * Creates animated water drops with ripples using canvas
 *
 * Uses unique namespace prefix "salameh-wd-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "transparent",
  backgroundImage: null,
  dropColor: "hsl(180, 100%, 50%)",
  rippleColor: "hsl(180, 100%, 50%)",
  maxDrops: 30,
  dropSpeed: 3,
  rippleSize: 80,
  clearColor: "rgba(0, 0, 0, .1)",
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-wd-";

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
    dropColor: validateColor(settings.dropColor, defaultSettings.dropColor),
    rippleColor: validateColor(settings.rippleColor, defaultSettings.rippleColor),
    maxDrops: Math.max(1, Math.min(100, validateNumber(settings.maxDrops, defaultSettings.maxDrops, 1, 100))),
    dropSpeed: Math.max(0.1, Math.min(10, validateNumber(settings.dropSpeed, defaultSettings.dropSpeed, 0.1, 10))),
    rippleSize: Math.max(10, Math.min(200, validateNumber(settings.rippleSize, defaultSettings.rippleSize, 10, 200))),
    clearColor: validateColor(settings.clearColor, defaultSettings.clearColor),
  };
};

/**
 * Helper function to apply opacity to any color format
 * @param {string} color - Color value
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} Color with opacity applied
 */
const applyOpacityToColor = (color, opacity) => {
  if (typeof color !== "string" || typeof opacity !== "number") {
    return color;
  }

  // Handle rgba format
  if (color.startsWith("rgba(")) {
    return color.replace(/[\d.]+\)$/, opacity + ")");
  }
  // Handle rgb format
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", ", " + opacity + ")");
  }
  // Handle hsl format
  if (color.startsWith("hsl(") && !color.startsWith("hsla(")) {
    return color.replace("hsl(", "hsla(").replace(")", ", " + opacity + ")");
  }
  // Handle hsla format
  if (color.startsWith("hsla(")) {
    return color.replace(/[\d.]+\)$/, opacity + ")");
  }
  // Handle hex format
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  // Handle named colors (convert to rgba)
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color;
      const computedColor = ctx.fillStyle;
      if (computedColor.startsWith("rgb(")) {
        return computedColor.replace("rgb(", "rgba(").replace(")", ", " + opacity + ")");
      }
    }
  } catch (error) {
    // Fallback to original color
  }
  return color; // Fallback
};

/**
 * Water Drops Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for rendering
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
function WaterDropsPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    console.error("WaterDropsPlugin: Invalid canvas element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let drops = [];
  let animationId = null;
  let backgroundImage = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-wd", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  // Optimize canvas rendering
  if (canvas.getContext) {
    context = canvas.getContext("2d", { alpha: true });
    if (context) {
      context.imageSmoothingEnabled = false;
    }
  }

  /**
   * Random number generator
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number between min and max
   */
  const random = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  /**
   * Creates a water drop object
   * @returns {Object} Water drop object
   */
  const createWaterDrop = () => {
    return {
      x: 0,
      y: 0,
      color: settings.dropColor,
      w: 0,
      h: 0,
      vy: 0,
      vw: 0,
      vh: 0,
      size: 0,
      hit: 0,
      a: 1,
      va: 0.96,
    };
  };

  /**
   * Initializes a water drop with random properties
   * @param {Object} drop - Drop object to initialize
   */
  const initWaterDrop = (drop) => {
    if (!screen.width || !screen.height) return;

    drop.x = random(0, screen.width);
    drop.y = 0;
    drop.color = settings.dropColor;

    // Adaptive sizing based on container height
    const minHeight = Math.min(screen.height, 200);
    const scaleFactor = Math.max(0.5, minHeight / 200);

    drop.w = Math.max(1, Math.floor(2 * scaleFactor));
    drop.h = Math.max(1, Math.floor(1 * scaleFactor));
    drop.vy = random(settings.dropSpeed * scaleFactor, (settings.dropSpeed + 1) * scaleFactor);
    drop.vw = Math.max(1, Math.floor(3 * scaleFactor));
    drop.vh = Math.max(1, Math.floor(1 * scaleFactor));
    drop.size = Math.max(1, Math.floor(2 * scaleFactor));

    // Hit point at the bottom of the container
    const hitRange = Math.min(0.1, screen.height / 200);
    drop.hit = random(screen.height * (0.9 - hitRange), screen.height * 0.9);

    drop.a = 1;
    drop.va = 0.96;
  };

  /**
   * Draws a water drop
   * @param {Object} drop - Drop object to draw
   */
  const drawWaterDrop = (drop) => {
    if (!context) return;

    if (drop.y > drop.hit) {
      // Draw ripple
      context.beginPath();
      context.moveTo(drop.x, drop.y - drop.h / 2);
      context.bezierCurveTo(drop.x + drop.w / 2, drop.y - drop.h / 2, drop.x + drop.w / 2, drop.y + drop.h / 2, drop.x, drop.y + drop.h / 2);
      context.bezierCurveTo(drop.x - drop.w / 2, drop.y + drop.h / 2, drop.x - drop.w / 2, drop.y - drop.h / 2, drop.x, drop.y - drop.h / 2);
      context.strokeStyle = applyOpacityToColor(settings.rippleColor, drop.a);
      context.stroke();
      context.closePath();
    } else {
      // Draw falling drop
      context.fillStyle = drop.color;
      context.fillRect(drop.x, drop.y, drop.size, drop.size * 5);
    }
    updateWaterDrop(drop);
  };

  /**
   * Updates a water drop position and state
   * @param {Object} drop - Drop object to update
   */
  const updateWaterDrop = (drop) => {
    if (drop.y < drop.hit) {
      drop.y += drop.vy;
    } else {
      if (drop.a > 0.03) {
        drop.w += drop.vw;
        drop.h += drop.vh;

        // Adaptive ripple size based on container height
        const minHeight = Math.min(screen.height, 200);
        const scaleFactor = Math.max(0.5, minHeight / 200);
        const adaptiveRippleSize = Math.max(20, settings.rippleSize * scaleFactor);

        if (drop.w > adaptiveRippleSize) {
          drop.a *= drop.va;
          drop.vw *= 0.98;
          drop.vh *= 0.98;
        }
      } else {
        initWaterDrop(drop);
      }
    }
  };

  /**
   * Draws the background
   */
  const drawBackground = () => {
    if (!context || !screen.width || !screen.height) return;

    // Clear with background color or image
    if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      // Draw background image with aspect ratio fitting
      const imgAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = screen.width / screen.height;
      let drawWidth = screen.width;
      let drawHeight = screen.height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawHeight = screen.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (screen.width - drawWidth) / 2;
      } else {
        drawWidth = screen.width;
        drawHeight = drawWidth / imgAspect;
        drawY = (screen.height - drawHeight) / 2;
      }

      context.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
    } else if (settings.backgroundColor === "transparent") {
      context.clearRect(0, 0, screen.width, screen.height);
    } else {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }

    // Apply fade effect for water drops
    context.fillStyle = settings.clearColor;
    context.fillRect(0, 0, screen.width, screen.height);
  };

  /**
   * Initializes the water drops animation
   */
  const initializeWaterDrops = () => {
    if (!canvas || !context) return;

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Calculate dimensions
    screen = {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height)),
    };

    // Set canvas dimensions
    canvas.width = screen.width;
    canvas.height = screen.height;

    // Load background image if provided
    if (settings.backgroundImage) {
      if (backgroundImage) {
        backgroundImage.onload = null;
        backgroundImage.onerror = null;
      }
      backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.onload = () => {
        // Background image loaded successfully
      };
      backgroundImage.onerror = () => {
        backgroundImage = null;
      };
      backgroundImage.src = settings.backgroundImage;
    } else {
      backgroundImage = null;
    }

    // Initialize water drops with staggered timing
    drops = [];
    for (let i = 0; i < settings.maxDrops; i++) {
      setTimeout(() => {
        const drop = createWaterDrop();
        initWaterDrop(drop);
        drops.push(drop);
      }, i * 200);
    }
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !screen.width || !screen.height) {
      animationId = requestAnimationFrame(render);
      return;
    }

    animationId = requestAnimationFrame(render);

    // Draw background
    drawBackground();

    // Draw all drops
    for (let i = 0; i < drops.length; i++) {
      drawWaterDrop(drops[i]);
    }
  };

  /**
   * Handles resize with debouncing
   */
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      initializeWaterDrops();
    }, 150);
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeWaterDrops();
    render();

    // Use ResizeObserver for better performance
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeHandler = new ResizeObserver(handleResize);
      resizeHandler.observe(canvas.parentElement);
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

    if (resizeHandler) {
      resizeHandler.disconnect();
      resizeHandler = null;
    } else {
      window.removeEventListener("resize", handleResize);
    }

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }

    if (context && screen.width && screen.height) {
      context.clearRect(0, 0, screen.width, screen.height);
    }

    if (backgroundImage) {
      backgroundImage.onload = null;
      backgroundImage.onerror = null;
      backgroundImage = null;
    }

    drops = [];
  };

  return { start, clean };
}

export default WaterDropsPlugin;
