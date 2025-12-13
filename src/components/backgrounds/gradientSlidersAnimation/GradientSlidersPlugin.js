/**
 * Gradient Sliders Animation Plugin
 * Creates animated gradient sliders with customizable settings
 *
 * Uses unique namespace prefix "salameh-gs-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#eee",
  backgroundImage: null,
  count: 3,
  colors: ["#FFEFBA", "#FFFFFF"],
  angle: -60,
  opacity: 0.5,
  duration: 3,
  speed: 1,
  enableAlternate: true,
  enableOpacity: true,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-gs-";

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
 * @param {Array} colors - Array of color strings
 * @param {Array} defaultValue - Default array if invalid
 * @returns {Array} Validated array
 */
const validateColorArray = (colors, defaultValue) => {
  if (!Array.isArray(colors) || colors.length < 2) {
    return defaultValue;
  }
  return colors
    .map((color) => validateColor(color, defaultValue[0]))
    .filter(Boolean)
    .slice(0, 2);
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
    angle: validateNumber(settings.angle, defaultSettings.angle, -360, 360),
    opacity: Math.max(0, Math.min(1, validateNumber(settings.opacity, defaultSettings.opacity, 0, 1))),
    duration: validateNumber(settings.duration, defaultSettings.duration, 0.1, 60),
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
    enableAlternate: Boolean(settings.enableAlternate !== false),
    enableOpacity: Boolean(settings.enableOpacity !== false),
  };
};

/**
 * Gradient Sliders Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function GradientSlidersPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let sliders = [];
  let animationId = null;
  let backgroundImage = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-gs", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Creates a single slider
   * @param {number} index - Slider index
   * @returns {Object} Slider object
   */
  const createSlider = (index) => {
    const baseDuration = settings.duration || 3;
    const speedMultiplier = settings.speed || 1;
    const duration = baseDuration / speedMultiplier;

    return {
      index: index,
      offset: 0,
      direction: 1,
      duration: index === 0 ? duration : index === 1 ? duration * 1.33 : duration * 1.67,
      startTime: performance.now(),
      opacity: settings.opacity,
    };
  };

  /**
   * Updates a slider
   * @param {Object} slider - Slider object to update
   * @param {number} currentTime - Current time in milliseconds
   */
  const updateSlider = (slider, currentTime) => {
    const elapsed = (currentTime - slider.startTime) / 1000;

    // Use continuous sine wave for truly infinite animation
    const frequency = (2 * Math.PI) / slider.duration;
    const phase = elapsed * frequency;

    // Calculate offset using sine wave for seamless looping
    const baseOffset = Math.sin(phase) * 25; // -25 to 25 range

    // Apply alternate direction for some sliders
    if (settings.enableAlternate && slider.index % 2 === 1) {
      slider.offset = -baseOffset; // Reverse direction
    } else {
      slider.offset = baseOffset; // Normal direction
    }

    // Ensure offset is finite
    slider.offset = isFinite(slider.offset) ? slider.offset : 0;

    // Update opacity if enabled with smoother variation
    if (settings.enableOpacity) {
      const opacityValue = settings.opacity * (0.95 + 0.05 * Math.sin(phase * 2));
      slider.opacity = isFinite(opacityValue) ? Math.max(0, Math.min(1, opacityValue)) : settings.opacity;
    }
  };

  /**
   * Draws a slider
   * @param {Object} slider - Slider object to draw
   */
  const drawSlider = (slider) => {
    if (!context) return;

    context.save();
    context.globalAlpha = slider.opacity;

    // Ensure offset is a valid number and within bounds
    const safeOffset = isFinite(slider.offset) ? Math.max(-50, Math.min(50, slider.offset)) : 0;

    // Calculate gradient coordinates to match the CSS design
    const translateX = (safeOffset * screen.width) / 100;

    // Use the angle from settings instead of hardcoded -60
    const angle = (settings.angle * Math.PI) / 180; // Convert degrees to radians

    // Calculate gradient coordinates for the specified angle
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const halfWidth = screen.width / 2;

    const centerX = halfWidth + translateX;
    const centerY = screen.height / 2;

    const gradient = context.createLinearGradient(centerX - cos * halfWidth, centerY - sin * halfWidth, centerX + cos * halfWidth, centerY + sin * halfWidth);

    // Add gradient stops to match the CSS: linear-gradient(angle, color1 50%, color2 50%)
    gradient.addColorStop(0, settings.colors[0]); // First color
    gradient.addColorStop(0.5, settings.colors[0]); // First color at 50%
    gradient.addColorStop(0.5, settings.colors[1]); // Second color at 50%
    gradient.addColorStop(1, settings.colors[1]); // Second color

    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, screen.width, screen.height);

    context.restore();
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
      try {
        context.drawImage(backgroundImage, 0, 0, screen.width, screen.height);
      } catch (error) {
        // Fallback to solid background if image draw fails
        context.fillStyle = settings.backgroundColor;
        context.fillRect(0, 0, screen.width, screen.height);
      }
    } else {
      // Create solid background
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the gradient sliders animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeGradientSliders = (newSettings = null) => {
    if (!canvas) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Get 2D context
    context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      return;
    }

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();

    // Calculate dimensions based on settings
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

    // Initialize gradient sliders
    sliders = [];
    for (let i = 0; i < settings.count; i++) {
      sliders.push(createSlider(i));
    }
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !canvas) return;

    const currentTime = performance.now();
    animationId = requestAnimationFrame(render);

    // Draw background
    drawBackground();

    // Update and draw sliders
    for (let i = 0; i < sliders.length; i++) {
      updateSlider(sliders[i], currentTime);
      drawSlider(sliders[i]);
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
      if (canvas) {
        // Stop current animation
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        // Reinitialize with current settings
        initializeGradientSliders();
        // Restart animation
        render();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeGradientSliders();
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

    // Clean up background image
    if (backgroundImage) {
      backgroundImage.onload = null;
      backgroundImage.onerror = null;
      backgroundImage = null;
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
    sliders = [];
    context = null;
    canvas = null;
    screen = { width: 0, height: 0 };
  };

  return {
    start,
    clean,
  };
}
