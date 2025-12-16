/**
 * Wave Animation Plugin
 * Creates animated rotating waves using canvas
 *
 * Uses unique namespace prefix "salameh-wave-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#0e6cc4",
  backgroundImage: null,
  count: 3,
  colors: ["#0af", "#77daff", "#000"],
  opacities: [0.4, 0.4, 0.1],
  durations: [7000, 7500, 3000],
  size: 1500,
  waveHeight: 1300,
  rotation: 80,
  radius: 43,
  offsetX: -150,
  originX: 50,
  offsetY: -250,
  originY: 48,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-wave-";

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
 * Validates array of colors
 * @param {Array} colors - Array of color values
 * @param {Array} defaultValue - Default array if invalid
 * @returns {Array} Validated array of colors
 */
const validateColorArray = (colors, defaultValue) => {
  if (!Array.isArray(colors) || colors.length === 0) {
    return defaultValue;
  }
  return colors.map((color) => validateColor(color, defaultValue[0] || "#0af"));
};

/**
 * Validates array of numbers
 * @param {Array} values - Array of numeric values
 * @param {Array} defaultValue - Default array if invalid
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {Array} Validated array of numbers
 */
const validateNumberArray = (values, defaultValue, min = -Infinity, max = Infinity) => {
  if (!Array.isArray(values) || values.length === 0) {
    return defaultValue;
  }
  return values.map((value) => validateNumber(value, defaultValue[0] || 0, min, max));
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
    count: Math.max(1, Math.min(10, validateNumber(settings.count, defaultSettings.count, 1, 10))),
    colors: validateColorArray(settings.colors, defaultSettings.colors),
    opacities: validateNumberArray(settings.opacities, defaultSettings.opacities, 0, 1),
    durations: validateNumberArray(settings.durations, defaultSettings.durations, 100, 60000),
    size: Math.max(100, Math.min(5000, validateNumber(settings.size, defaultSettings.size, 100, 5000))),
    waveHeight: Math.max(100, Math.min(5000, validateNumber(settings.waveHeight, defaultSettings.waveHeight, 100, 5000))),
    rotation: Math.max(0, Math.min(360, validateNumber(settings.rotation, defaultSettings.rotation, 0, 360))),
    radius: Math.max(0, Math.min(100, validateNumber(settings.radius, defaultSettings.radius, 0, 100))),
    offsetX: validateNumber(settings.offsetX, defaultSettings.offsetX, -10000, 10000),
    originX: Math.max(0, Math.min(100, validateNumber(settings.originX, defaultSettings.originX, 0, 100))),
    offsetY: validateNumber(settings.offsetY, defaultSettings.offsetY, -10000, 10000),
    originY: Math.max(0, Math.min(100, validateNumber(settings.originY, defaultSettings.originY, 0, 100))),
  };
};

/**
 * Wave Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for rendering
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
function WavePlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    console.error("WavePlugin: Invalid canvas element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let waves = [];
  let animationId = null;
  let lastFrame = 0;
  let backgroundImage = null;
  let screen = { width: 0, height: 0 };
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Reference screen dimensions for responsive scaling (1920x1080 as base)
  const REFERENCE_WIDTH = 1920;
  const REFERENCE_HEIGHT = 1080;

  /**
   * Calculates responsive scale factor based on screen dimensions
   * Uses proportional scaling to maintain consistent appearance across all screen sizes
   * @returns {Object} Scale factors for width, height, and unified scale
   */
  const getScaleFactors = () => {
    if (!screen.width || !screen.height) {
      return { scaleX: 1, scaleY: 1, scale: 1 };
    }

    // Calculate scale factors for width and height (proportional to reference)
    const scaleX = screen.width / REFERENCE_WIDTH;
    const scaleY = screen.height / REFERENCE_HEIGHT;

    // Use the smaller scale for unified sizing to ensure waves fit on screen
    // This maintains aspect ratio while ensuring waves don't overflow
    // Minimum scale ensures waves remain visible on very small screens
    const minScale = Math.max(0.25, Math.min(scaleX, scaleY));

    // Cap maximum scale at 1.5x to prevent oversized waves on very large screens
    // This ensures waves don't become too large relative to the screen
    const scale = Math.min(minScale, 1.5);

    return { scaleX, scaleY, scale };
  };

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-wave", "canvas");
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
   * Creates a single wave object
   * @param {number} index - Wave index
   * @returns {Object} Wave object with update and draw methods
   */
  const createWave = (index) => {
    const startTime = performance.now();
    const duration = settings.durations[index] || settings.durations[0] || defaultSettings.durations[0];
    const color = settings.colors[index] || settings.colors[0] || defaultSettings.colors[0];
    const opacity = settings.opacities[index] !== undefined ? settings.opacities[index] : settings.opacities[0] || defaultSettings.opacities[0];

    /**
     * Updates wave rotation based on elapsed time
     * @param {number} currentTime - Current timestamp
     * @returns {number} Current rotation in degrees
     */
    const updateWave = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      return progress * 360;
    };

    /**
     * Draws the wave
     * @param {number} currentRotation - Current rotation in degrees
     */
    const drawWave = (currentRotation) => {
      if (!context || !screen.width || !screen.height) return;

      context.save();

      // Set opacity
      context.globalAlpha = opacity;

      // Set fill color
      context.fillStyle = color;

      // Calculate responsive scale factors
      const { scaleX, scaleY, scale } = getScaleFactors();

      // Calculate responsive wave size (scale based on screen dimensions)
      // Use unified scale to maintain aspect ratio
      const waveWidth = settings.size * scale;
      const waveHeight = settings.waveHeight * scale;

      // Calculate the reference base position (on 1920x1080 screen)
      const referenceBaseX = REFERENCE_WIDTH * 0.1;
      const referenceBaseY = REFERENCE_HEIGHT * 0.03;

      // Scale the entire positioning system (base + offsets) proportionally
      // This ensures waves maintain the exact same relative position on all screen sizes
      const totalOffsetX = referenceBaseX + settings.offsetX;
      const totalOffsetY = referenceBaseY + settings.offsetY;

      // Scale the total position to current screen size
      const waveX = totalOffsetX * scaleX;
      const waveY = totalOffsetY * scaleY;

      // Apply rotation transform
      context.translate(waveX + waveWidth / 2, waveY + waveHeight / 2);
      context.rotate((settings.rotation * Math.PI) / 180);
      context.rotate((currentRotation * Math.PI) / 180);

      // Draw wave as rounded rectangle
      context.beginPath();

      const radius = (settings.radius / 100) * Math.min(waveWidth, waveHeight);
      const centerX = -waveWidth / 2;
      const centerY = -waveHeight / 2;

      // Draw rounded rectangle using arcs
      context.moveTo(centerX + radius, centerY);
      context.lineTo(centerX + waveWidth - radius, centerY);
      context.quadraticCurveTo(centerX + waveWidth, centerY, centerX + waveWidth, centerY + radius);
      context.lineTo(centerX + waveWidth, centerY + waveHeight - radius);
      context.quadraticCurveTo(centerX + waveWidth, centerY + waveHeight, centerX + waveWidth - radius, centerY + waveHeight);
      context.lineTo(centerX + radius, centerY + waveHeight);
      context.quadraticCurveTo(centerX, centerY + waveHeight, centerX, centerY + waveHeight - radius);
      context.lineTo(centerX, centerY + radius);
      context.quadraticCurveTo(centerX, centerY, centerX + radius, centerY);
      context.closePath();

      context.fill();
      context.restore();
    };

    return {
      index,
      startTime,
      duration,
      color,
      opacity,
      update: updateWave,
      draw: drawWave,
    };
  };

  /**
   * Draws the background
   */
  const drawBackground = () => {
    if (!context || !screen.width || !screen.height) return;

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
    } else {
      // Create solid background
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the wave animation
   */
  const initializeWave = () => {
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

    // Initialize waves
    waves = [];
    for (let i = 0; i < settings.count; i++) {
      waves.push(createWave(i));
    }

    // Initialize timing
    lastFrame = 0;
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !screen.width || !screen.height) {
      animationId = requestAnimationFrame(render);
      return;
    }

    const currentTime = performance.now();
    lastFrame = currentTime;
    animationId = requestAnimationFrame(render);

    // Draw background
    drawBackground();

    // Update and draw waves
    for (let i = 0; i < waves.length; i++) {
      const currentRotation = waves[i].update(currentTime);
      waves[i].draw(currentRotation);
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
      initializeWave();
    }, 150);
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeWave();
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

    waves = [];
  };

  return { start, clean };
}

export default WavePlugin;
