/**
 * Floating Balls Animation Plugin
 * Creates animated floating balls with connection lines and mouse interaction
 *
 * Uses unique namespace prefix "salameh-fb-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "transparent",
  backgroundImage: null,
  colors: { r: 255, g: 234, b: 0 },
  radius: 4,
  count: 30,
  max: 20,
  alphaFade: 0.03,
  linkLineWidth: 0.2,
  connectionDistance: 150,
  connectionColor: "yellow",
  addMouseInteraction: true,
  speed: 2,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-fb-";

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
 * Validates color string or RGB object
 * @param {string|Object} color - Color value to validate
 * @param {string|Object} defaultValue - Default color if invalid
 * @returns {string|Object} Validated color
 */
const validateColor = (color, defaultValue) => {
  if (typeof color === "string" && color.trim()) {
    return color.trim();
  }
  if (typeof color === "object" && color !== null && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
    return {
      r: Math.max(0, Math.min(255, validateNumber(color.r, defaultValue.r || 255, 0, 255))),
      g: Math.max(0, Math.min(255, validateNumber(color.g, defaultValue.g || 234, 0, 255))),
      b: Math.max(0, Math.min(255, validateNumber(color.b, defaultValue.b || 0, 0, 255))),
    };
  }
  return defaultValue;
};

/**
 * Normalizes settings with validation
 * @param {Object} settings - Settings to normalize
 * @returns {Object} Normalized settings
 */
const normalizeSettings = (settings) => {
  const defaultColor = defaultSettings.colors;
  return {
    backgroundColor: validateColor(settings.backgroundColor, defaultSettings.backgroundColor),
    backgroundImage: settings.backgroundImage || null,
    colors: validateColor(settings.colors, defaultColor),
    radius: validateNumber(settings.radius, defaultSettings.radius, 1, 50),
    count: Math.max(1, Math.min(200, validateNumber(settings.count, defaultSettings.count, 1, 200))),
    max: Math.max(1, Math.min(200, validateNumber(settings.max, defaultSettings.max, 1, 200))),
    alphaFade: validateNumber(settings.alphaFade, defaultSettings.alphaFade, 0, 1),
    linkLineWidth: validateNumber(settings.linkLineWidth, defaultSettings.linkLineWidth, 0, 10),
    connectionDistance: validateNumber(settings.connectionDistance, defaultSettings.connectionDistance, 10, 500),
    connectionColor: validateColor(settings.connectionColor, defaultSettings.connectionColor),
    addMouseInteraction: Boolean(settings.addMouseInteraction !== false),
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
  };
};

/**
 * Floating Balls Animation Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function FloatingBallsPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let canvas = null;
  let context = null;
  let screen = { width: 0, height: 0 };
  let balls = [];
  let animationId = null;
  let backgroundImage = null;
  let mouse_in = false;
  let mouse_ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    type: "mouse",
  };
  let eventHandlers = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Random speed generator
  const getRandomSpeed = (pos, speedMultiplier = 1) => {
    let min = -1 * speedMultiplier;
    let max = 1 * speedMultiplier;
    switch (pos) {
      case "top":
        return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
      case "right":
        return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
      case "bottom":
        return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
      case "left":
        return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
      default:
        return [randomNumFrom(min, max), randomNumFrom(min, max)];
    }
  };

  const randomArrayItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const randomNumFrom = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const randomSidePos = (length) => {
    return Math.ceil(Math.random() * length);
  };

  // Create random ball
  const getRandomBall = () => {
    let pos = randomArrayItem(["top", "right", "bottom", "left"]);
    let speedMultiplier = settings.speed;

    switch (pos) {
      case "top":
        return {
          x: randomSidePos(screen.width),
          y: -settings.radius,
          vx: getRandomSpeed("top", speedMultiplier)[0],
          vy: getRandomSpeed("top", speedMultiplier)[1],
          r: settings.radius,
          alpha: 1,
          phase: randomNumFrom(0, 10),
        };
      case "right":
        return {
          x: screen.width + settings.radius,
          y: randomSidePos(screen.height),
          vx: getRandomSpeed("right", speedMultiplier)[0],
          vy: getRandomSpeed("right", speedMultiplier)[1],
          r: settings.radius,
          alpha: 1,
          phase: randomNumFrom(0, 10),
        };
      case "bottom":
        return {
          x: randomSidePos(screen.width),
          y: screen.height + settings.radius,
          vx: getRandomSpeed("bottom", speedMultiplier)[0],
          vy: getRandomSpeed("bottom", speedMultiplier)[1],
          r: settings.radius,
          alpha: 1,
          phase: randomNumFrom(0, 10),
        };
      case "left":
        return {
          x: -settings.radius,
          y: randomSidePos(screen.height),
          vx: getRandomSpeed("left", speedMultiplier)[0],
          vy: getRandomSpeed("left", speedMultiplier)[1],
          r: settings.radius,
          alpha: 1,
          phase: randomNumFrom(0, 10),
        };
    }
  };

  // Initialize balls
  const initBalls = () => {
    balls = [];
    for (let i = 0; i < settings.count; i++) {
      balls.push(getRandomBall());
    }
  };

  // Update ball positions
  const updateBalls = () => {
    let new_balls = [];
    Array.prototype.forEach.call(balls, (b) => {
      // Skip mouse ball - it follows cursor, not physics
      if (b.hasOwnProperty("type") && b.type === "mouse") {
        new_balls.push(b);
        return;
      }

      b.x += b.vx;
      b.y += b.vy;

      if (b.x > -50 && b.x < screen.width + 50 && b.y > -50 && b.y < screen.height + 50) {
        new_balls.push(b);
      }

      // alpha change
      b.phase += settings.alphaFade;
      b.alpha = Math.abs(Math.cos(b.phase));
    });

    balls.length = 0;
    balls.push(...new_balls);
  };

  // Add new ball if needed
  const addBallIfy = () => {
    if (balls.length < settings.max) {
      balls.push(getRandomBall());
    }
  };

  // Cache for connection color RGB values to avoid repeated DOM operations
  let connectionColorCache = null;

  // Convert color to rgba format (optimized with caching)
  const getConnectionColor = (alpha) => {
    const color = settings.connectionColor;

    // If it's already in rgba format (ends with comma)
    if (typeof color === "string" && color.endsWith(",")) {
      return color + alpha + ")";
    }

    // Cache RGB values to avoid repeated DOM operations
    if (!connectionColorCache) {
      // If it's a hex color
      if (typeof color === "string" && color.startsWith("#")) {
        connectionColorCache = {
          r: parseInt(color.slice(1, 3), 16),
          g: parseInt(color.slice(3, 5), 16),
          b: parseInt(color.slice(5, 7), 16),
        };
      } else if (typeof color === "string") {
        // If it's a named color or other format, create a temporary element to get RGB values
        const tempElement = document.createElement("div");
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        const computedColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);

        // Extract RGB values from computed color (format: "rgb(r, g, b)")
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          connectionColorCache = {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
          };
        } else {
          connectionColorCache = { r: 150, g: 150, b: 150 }; // Fallback
        }
      } else {
        connectionColorCache = { r: 150, g: 150, b: 150 }; // Fallback
      }
    }

    return `rgba(${connectionColorCache.r}, ${connectionColorCache.g}, ${connectionColorCache.b}, ${alpha})`;
  };

  // Cache for ball color RGB values to avoid repeated DOM operations
  let ballColorCache = null;

  // Convert ball color to rgba format (optimized with caching)
  const getBallColor = (alpha) => {
    const ballColor = settings.colors;

    // If it's already an RGB object
    if (typeof ballColor === "object" && ballColor.r !== undefined && ballColor.g !== undefined && ballColor.b !== undefined) {
      return `rgba(${ballColor.r}, ${ballColor.g}, ${ballColor.b}, ${alpha})`;
    }

    // Cache RGB values to avoid repeated DOM operations
    if (!ballColorCache && typeof ballColor === "string") {
      // If it's a hex color
      if (ballColor.startsWith("#")) {
        ballColorCache = {
          r: parseInt(ballColor.slice(1, 3), 16),
          g: parseInt(ballColor.slice(3, 5), 16),
          b: parseInt(ballColor.slice(5, 7), 16),
        };
      } else {
        // If it's a named color or other format, create a temporary element to get RGB values
        const tempElement = document.createElement("div");
        tempElement.style.color = ballColor;
        document.body.appendChild(tempElement);
        const computedColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);

        // Extract RGB values from computed color (format: "rgb(r, g, b)")
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          ballColorCache = {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
          };
        } else {
          ballColorCache = { r: 255, g: 234, b: 0 }; // Fallback
        }
      }
    }

    if (ballColorCache) {
      return `rgba(${ballColorCache.r}, ${ballColorCache.g}, ${ballColorCache.b}, ${alpha})`;
    }

    // Fallback to default color
    return `rgba(255, 234, 0, ${alpha})`;
  };

  // Render balls
  const renderBalls = () => {
    if (!context) return;

    Array.prototype.forEach.call(balls, (b) => {
      // Render all balls including mouse ball
      context.fillStyle = getBallColor(b.alpha || 1);
      context.beginPath();
      context.arc(b.x, b.y, settings.radius, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    });
  };

  // Calculate distance between two points
  const getDisOf = (b1, b2) => {
    let delta_x = Math.abs(b1.x - b2.x);
    let delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
  };

  // Render connection lines
  const renderLines = () => {
    if (!context) return;

    let fraction, alpha;
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        fraction = getDisOf(balls[i], balls[j]) / settings.connectionDistance;

        if (fraction < 1) {
          alpha = (1 - fraction).toString();

          context.strokeStyle = getConnectionColor(alpha);
          context.lineWidth = settings.linkLineWidth;

          context.beginPath();
          context.moveTo(balls[i].x, balls[i].y);
          context.lineTo(balls[j].x, balls[j].y);
          context.stroke();
          context.closePath();
        }
      }
    }
  };

  /**
   * Initializes the floating balls animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeFloatingBalls = (newSettings = null) => {
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
    canvas.setAttribute("data-salameh-fb", "canvas");
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
    canvas.style.pointerEvents = settings.addMouseInteraction ? "auto" : "none";

    // Get 2D context
    context = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!context) {
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
        // Background image failed to load, use transparent background
        backgroundImage = null;
      };
      backgroundImage.src = settings.backgroundImage;
    }

    // Reset color caches when settings change
    connectionColorCache = null;
    ballColorCache = null;

    // Initialize balls
    initBalls();

    // Append canvas to container
    container.appendChild(canvas);

    // Ensure container has required styles
    if (container.style.position !== "relative") {
      container.style.position = "relative";
    }
    if (container.style.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }

    // Add mouse event listeners if enabled
    if (settings.addMouseInteraction) {
      const mouseEnterHandler = () => {
        mouse_in = true;
        // Only add mouse ball if it's not already in the array and mouse_ball exists
        if (mouse_ball) {
          const mouseBallExists = balls.some((ball) => ball.type === "mouse");
          if (!mouseBallExists) {
            balls.push(mouse_ball);
          }
        }
      };

      const mouseLeaveHandler = () => {
        mouse_in = false;
        // Remove mouse ball from array
        balls = balls.filter((ball) => ball.type !== "mouse");
      };

      const mouseMoveHandler = (event) => {
        if (!mouse_ball || !canvas) return;

        let e = event || window.event;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        mouse_ball.x = (e.clientX - rect.left) * scaleX;
        mouse_ball.y = (e.clientY - rect.top) * scaleY;

        // Update mouse ball alpha for visual feedback
        mouse_ball.phase += settings.alphaFade;
        mouse_ball.alpha = Math.abs(Math.cos(mouse_ball.phase));
      };

      canvas.addEventListener("mouseenter", mouseEnterHandler, { passive: true });
      canvas.addEventListener("mouseleave", mouseLeaveHandler, { passive: true });
      canvas.addEventListener("mousemove", mouseMoveHandler, { passive: true });

      // Store event handlers for cleanup
      eventHandlers = {
        mouseEnter: mouseEnterHandler,
        mouseLeave: mouseLeaveHandler,
        mouseMove: mouseMoveHandler,
      };
    }
  };

  // Main render function
  const render = () => {
    if (!context || !canvas) {
      return;
    }

    animationId = requestAnimationFrame(render);

    // Clear with background color or image
    if (backgroundImage && backgroundImage.complete) {
      context.drawImage(backgroundImage, 0, 0, screen.width, screen.height);
    } else if (settings.backgroundColor === "transparent") {
      context.clearRect(0, 0, screen.width, screen.height);
    } else {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }

    renderBalls();
    renderLines();
    updateBalls();
    addBallIfy();
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
        initializeFloatingBalls();
        // Restart animation
        if (canvas && context) {
          render();
        }
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeFloatingBalls();
    if (canvas && context) {
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

    // Remove event listeners if they exist
    if (eventHandlers && canvas) {
      canvas.removeEventListener("mouseenter", eventHandlers.mouseEnter);
      canvas.removeEventListener("mouseleave", eventHandlers.mouseLeave);
      canvas.removeEventListener("mousemove", eventHandlers.mouseMove);
      eventHandlers = null;
    }

    // Clear canvas
    if (context && screen) {
      context.clearRect(0, 0, screen.width, screen.height);
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
    balls = [];
    backgroundImage = null;
    connectionColorCache = null;
    ballColorCache = null;
    context = null;
    container = null;
  };

  return {
    start,
    clean,
  };
}
