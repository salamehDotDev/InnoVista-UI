/**
 * Fireflies Animation Plugin
 * Creates animated fireflies with customizable settings
 *
 * Uses unique namespace prefix "salameh-ff-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#0a0a0a",
  backgroundImage: null,
  count: 30,
  color: "#ffff00",
  size: 2,
  opacity: 0.8,
  fireflySpeed: 0.5,
  glow: true,
  glowIntensity: 0.6,
  glowSize: 15,
  flickerSpeed: 0.02,
  flickerIntensity: 0.3,
  enableTrails: true,
  trailLength: 5,
  trailOpacity: 0.1,
  enableWander: true,
  wanderSpeed: 0.3,
  wanderRadius: 50,
  speed: 1,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-ff-";

// Class names with unique namespace
const CLASS_NAMES = {
  canvas: `${NAMESPACE_PREFIX}canvas`,
  container: `${NAMESPACE_PREFIX}container`,
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
    count: Math.max(1, Math.min(200, validateNumber(settings.count, defaultSettings.count, 1, 200))),
    color: validateColor(settings.color, defaultSettings.color),
    size: validateNumber(settings.size, defaultSettings.size, 0.5, 10),
    opacity: validateNumber(settings.opacity, defaultSettings.opacity, 0, 1),
    fireflySpeed: validateNumber(settings.fireflySpeed, defaultSettings.fireflySpeed, 0.1, 5),
    glow: Boolean(settings.glow !== false),
    glowIntensity: validateNumber(settings.glowIntensity, defaultSettings.glowIntensity, 0, 1),
    glowSize: validateNumber(settings.glowSize, defaultSettings.glowSize, 1, 50),
    flickerSpeed: validateNumber(settings.flickerSpeed, defaultSettings.flickerSpeed, 0, 0.1),
    flickerIntensity: validateNumber(settings.flickerIntensity, defaultSettings.flickerIntensity, 0, 1),
    enableTrails: Boolean(settings.enableTrails !== false),
    trailLength: Math.max(0, Math.min(20, validateNumber(settings.trailLength, defaultSettings.trailLength, 0, 20))),
    trailOpacity: validateNumber(settings.trailOpacity, defaultSettings.trailOpacity, 0, 1),
    enableWander: Boolean(settings.enableWander !== false),
    wanderSpeed: validateNumber(settings.wanderSpeed, defaultSettings.wanderSpeed, 0, 2),
    wanderRadius: validateNumber(settings.wanderRadius, defaultSettings.wanderRadius, 10, 200),
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
  };
};

/**
 * Fireflies Animation Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function FirefliesPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let canvas = null;
  let c = null;
  let screen = { width: 0, height: 0 };
  let fireflies = [];
  let animationId = null;
  let backgroundImage = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Firefly particle class
  const Firefly = () => {
    let x = Math.random() * screen.width;
    let y = Math.random() * screen.height;
    let size = Math.random() * settings.size + 1;
    let opacity = Math.random() * settings.opacity + 0.2;
    let speed = Math.random() * settings.fireflySpeed + 0.2;
    let angle = Math.random() * Math.PI * 2;
    let angleSpeed = (Math.random() - 0.5) * 0.02;
    let flickerPhase = Math.random() * Math.PI * 2;
    let flickerSpeed = Math.random() * settings.flickerSpeed + 0.01;
    let glowPhase = Math.random() * Math.PI * 2;
    let glowSpeed = Math.random() * 0.03 + 0.01;
    let currentOpacity;
    let currentGlow;

    // Trail properties
    let trail = [];
    let maxTrailLength = settings.trailLength;

    // Wandering properties
    let targetX = x;
    let targetY = y;
    let wanderTimer = 0;
    let wanderInterval = Math.random() * 200 + 100;

    const update = function () {
      // Update flickering
      flickerPhase += flickerSpeed;
      const flicker = 1 + Math.sin(flickerPhase) * settings.flickerIntensity;

      // Update glow
      glowPhase += glowSpeed;
      const glow = 0.5 + Math.sin(glowPhase) * 0.5;

      // Update wandering
      if (settings.enableWander) {
        wanderTimer++;
        if (wanderTimer > wanderInterval) {
          targetX = x + (Math.random() - 0.5) * settings.wanderRadius * 2;
          targetY = y + (Math.random() - 0.5) * settings.wanderRadius * 2;
          wanderTimer = 0;
          wanderInterval = Math.random() * 200 + 100;
        }

        // Move towards target
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          x += (dx / distance) * settings.wanderSpeed * settings.speed;
          y += (dy / distance) * settings.wanderSpeed * settings.speed;
        }
      }

      // Update angle
      angle += angleSpeed;

      // Add some random movement
      x += Math.sin(angle) * speed * settings.speed;
      y += Math.cos(angle) * speed * settings.speed;

      // Wrap around screen edges
      if (x < -size) x = screen.width + size;
      if (x > screen.width + size) x = -size;
      if (y < -size) y = screen.height + size;
      if (y > screen.height + size) y = -size;

      // Update trail
      if (settings.enableTrails) {
        trail.push({ x: x, y: y, opacity: opacity * flicker });
        if (trail.length > maxTrailLength) {
          trail.shift();
        }
      }

      // Store current opacity for drawing
      currentOpacity = opacity * flicker;
      currentGlow = glow;
    };

    const draw = function () {
      if (!c) return;

      c.save();

      // Draw trail
      if (settings.enableTrails && trail.length > 0) {
        for (let i = 0; i < trail.length; i++) {
          const trailPoint = trail[i];
          const trailOpacity = trailPoint.opacity * settings.trailOpacity * (i / trail.length);

          c.globalAlpha = trailOpacity;
          c.fillStyle = settings.color;
          c.beginPath();
          c.arc(trailPoint.x, trailPoint.y, size * 0.5, 0, Math.PI * 2);
          c.fill();
        }
      }

      // Draw glow effect
      if (settings.glow) {
        c.globalAlpha = currentOpacity * currentGlow * settings.glowIntensity;
        c.fillStyle = settings.color;
        c.beginPath();
        c.arc(x, y, settings.glowSize, 0, Math.PI * 2);
        c.fill();

        // Draw inner glow
        c.globalAlpha = currentOpacity * currentGlow * settings.glowIntensity * 0.5;
        c.beginPath();
        c.arc(x, y, settings.glowSize * 0.6, 0, Math.PI * 2);
        c.fill();
      }

      // Draw firefly core
      c.globalAlpha = currentOpacity;
      c.fillStyle = settings.color;
      c.beginPath();
      c.arc(x, y, size, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    return { update, draw };
  };

  /**
   * Initializes the fireflies animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeFireflies = (newSettings = null) => {
    if (!container) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Clean up existing canvas
    const existingCanvas = container.querySelector(`canvas.${CLASS_NAMES.canvas}`);
    if (existingCanvas && existingCanvas.parentNode === container) {
      existingCanvas.remove();
    }

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    screen = {
      width: Math.max(1, Math.floor(rect.width) || 800),
      height: Math.max(1, Math.floor(rect.height) || 600),
    };

    // Create canvas element
    canvas = document.createElement("canvas");
    canvas.className = CLASS_NAMES.canvas;
    canvas.setAttribute("data-salameh-ff", "canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    canvas.width = screen.width;
    canvas.height = screen.height;

    // Set canvas styles
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";

    // Get 2D context
    c = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!c) {
      return;
    }

    // Load background image if provided
    if (settings.backgroundImage) {
      backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.onload = function () {
        // Background image loaded successfully
      };
      backgroundImage.onerror = function () {
        // Background image failed to load, use solid background
        backgroundImage = null;
      };
      backgroundImage.src = settings.backgroundImage;
    }

    // Initialize fireflies
    fireflies = [];
    for (let i = 0; i < settings.count; i++) {
      fireflies.push(Firefly());
    }

    // Append canvas to container
    container.appendChild(canvas);

    // Ensure container has required styles
    if (container.style.position !== "relative") {
      container.style.position = "relative";
    }
    if (container.style.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }
  };

  /**
   * Renders the animation frame
   */
  const render = (time) => {
    if (!c || !canvas) return;

    animationId = requestAnimationFrame(render);

    // Clear with background color or image
    if (backgroundImage && backgroundImage.complete) {
      c.drawImage(backgroundImage, 0, 0, screen.width, screen.height);
    } else if (settings.backgroundColor === "transparent") {
      c.clearRect(0, 0, screen.width, screen.height);
    } else {
      c.fillStyle = settings.backgroundColor;
      c.fillRect(0, 0, screen.width, screen.height);
    }

    // Update and draw fireflies
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].update();
      fireflies[i].draw();
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
      if (container) {
        // Stop current animation
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        // Reinitialize with current settings
        initializeFireflies();
        // Restart animation
        if (canvas && c) {
          render();
        }
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeFireflies();
    if (canvas && c) {
      render();
      resizeHandler = handleResize;
      window.addEventListener("resize", resizeHandler, { passive: true });
    }
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
    if (c) {
      c.clearRect(0, 0, screen.width, screen.height);
    }

    // Remove canvas element
    if (canvas && canvas.parentNode) {
      try {
        canvas.remove();
      } catch (error) {
      }
      canvas = null;
    }

    // Clean up references
    fireflies = [];
    backgroundImage = null;
    c = null;
    container = null;
  };

  return {
    start,
    clean,
  };
}
