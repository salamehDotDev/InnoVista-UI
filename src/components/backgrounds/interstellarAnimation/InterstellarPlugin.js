/**
 * Interstellar Animation Plugin
 * Creates animated interstellar effect with stars, rings, and mouse interaction
 *
 * Uses unique namespace prefix "salameh-int-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#000000",
  backgroundImage: null,
  ringCount: 35,
  starCount: 150,
  scale: 150,
  spring: 0.95,
  friction: 0.95,
  text1: "",
  text2: "",
  speed: 1,
  enableMouseInteraction: true,
  enableGlow: false,
  glowIntensity: 0.3,
  enablePulse: false,
  pulseSpeed: 0.02,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-int-";

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
    ringCount: Math.max(1, Math.min(100, validateNumber(settings.ringCount, defaultSettings.ringCount, 1, 100))),
    starCount: Math.max(1, Math.min(500, validateNumber(settings.starCount, defaultSettings.starCount, 1, 500))),
    scale: validateNumber(settings.scale, defaultSettings.scale, 10, 1000),
    spring: Math.max(0.1, Math.min(1, validateNumber(settings.spring, defaultSettings.spring, 0.1, 1))),
    friction: Math.max(0.1, Math.min(1, validateNumber(settings.friction, defaultSettings.friction, 0.1, 1))),
    text1: typeof settings.text1 === "string" ? settings.text1 : "",
    text2: typeof settings.text2 === "string" ? settings.text2 : "",
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
    enableMouseInteraction: Boolean(settings.enableMouseInteraction !== false),
    enableGlow: Boolean(settings.enableGlow === true),
    glowIntensity: Math.max(0, Math.min(1, validateNumber(settings.glowIntensity, defaultSettings.glowIntensity, 0, 1))),
    enablePulse: Boolean(settings.enablePulse === true),
    pulseSpeed: Math.max(0.001, Math.min(0.1, validateNumber(settings.pulseSpeed, defaultSettings.pulseSpeed, 0.001, 0.1))),
  };
};

/**
 * Interstellar Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function InterstellarPlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let stars = [];
  let animationId = null;
  let backgroundImage = null;
  let mouseX = 0;
  let mouseY = 0;
  let _mouseX = 0;
  let _mouseY = 0;
  let invX = 0;
  let invY = 0;
  let _invX = 0;
  let _invY = 0;
  let flag = 1;
  let midX = [];
  let midY = [];
  let rad = [];
  let eventHandlers = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;
  let pulsePhase = 0;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-int", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Creates a single star
   * @returns {Object} Star object
   */
  const createStar = () => {
    return {
      s: {
        tlap: 8000,
        maxx: 5,
        maxy: 2,
        rmax: 5,
        rt: 1,
        dx: 960,
        dy: 540,
        mvx: 4,
        mvy: 4,
        rnd: true,
        twinkle: true,
      },
      x: 0,
      y: 0,
      r: 0,
      dx: 0,
      dy: 0,
      tw: 0,
      rt: 0,
      cs: 0,
    };
  };

  /**
   * Resets a star
   * @param {Object} star - Star object to reset
   */
  const resetStar = (star) => {
    star.x = star.s.rnd ? screen.width * Math.random() : star.s.dx;
    star.y = star.s.rnd ? screen.height * Math.random() : star.s.dy;
    star.r = (star.s.rmax - 1) * Math.random() + 0.5;
    star.dx = Math.random() * star.s.maxx * (Math.random() < 0.5 ? -1 : 1);
    star.dy = Math.random() * star.s.maxy * (Math.random() < 0.5 ? -1 : 1);
    star.tw = (star.s.tlap / 60) * (star.r / star.s.rmax);
    star.rt = Math.random() * star.tw;
    star.s.rt = Math.random() + 1;
    star.cs = Math.random() * 0.2 + 0.4;
    star.s.mvx *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
    star.s.mvy *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
  };

  /**
   * Fades a star
   * @param {Object} star - Star object to fade
   */
  const fadeStar = (star) => {
    star.rt += star.s.rt * settings.speed;
  };

  /**
   * Draws a star
   * @param {Object} star - Star object to draw
   */
  const drawStar = (star) => {
    if (!context) return;

    if (star.s.twinkle && (star.rt <= 0 || star.rt >= star.tw)) {
      star.s.rt = star.s.rt * -1;
    } else if (star.rt >= star.tw) {
      resetStar(star);
    }

    let o = 1 - star.rt / star.tw;
    context.beginPath();
    context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true);
    context.closePath();

    let rad = star.r * o;
    if (rad <= 0) rad = 1;

    let g = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, rad);
    g.addColorStop(0.0, `hsla(255, 255%, 255%, ${o})`);
    g.addColorStop(star.cs, `hsla(201, 95%, 25%, ${o * 0.6})`);
    g.addColorStop(1.0, "hsla(201, 95%, 45%, 0)");
    context.fillStyle = g;
    context.fill();
  };

  /**
   * Animates a star
   * @param {Object} star - Star object to animate
   */
  const animateStar = (star) => {
    star.x += (star.rt / star.tw) * star.dx * settings.speed;
    star.y += (star.rt / star.tw) * star.dy * settings.speed;
    if (star.x > screen.width || star.x < 0) star.dx *= -1;
    if (star.y > screen.height || star.y < 0) star.dy *= -1;
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    // Clear canvas with background color
    context.fillStyle = settings.backgroundColor;
    context.fillRect(0, 0, screen.width, screen.height);

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
        context.fillStyle = settings.backgroundColor;
        context.fillRect(0, 0, screen.width, screen.height);
      }
    }
  };

  /**
   * Draws text
   */
  const drawText = () => {
    if (!context || (!settings.text1 && !settings.text2)) return;

    context.font = "3em Economica";
    context.fillStyle = "hsla(220, 95%, 75%, .55)";

    if (settings.text1) {
      let t0 = settings.text1.split("").join(String.fromCharCode(0x2004));
      context.fillText(t0, (screen.width - context.measureText(t0).width) * 0.5, screen.height * 0.45);
    }

    if (settings.text2) {
      let t = settings.text2.split("").join(String.fromCharCode(0x2004));
      context.fillText(t, (screen.width - context.measureText(t).width) * 0.5, screen.height * 0.55);
    }
  };

  /**
   * Fills with gradient
   */
  const fill = () => {
    if (!context) return;

    context.globalCompositeOperation = "source-over";
    let g_ = context.createLinearGradient(screen.width + screen.width, screen.height + screen.height * 1.5, screen.width + screen.width, 1);
    g_.addColorStop(0, "hsla(220, 95%, 10%, .55)");
    g_.addColorStop(0.5, "hsla(220, 95%, 30%, .55)");
    g_.addColorStop(1, "hsla(0, 0%, 5%, 1)");
    context.fillStyle = g_;
    context.fillRect(0, 0, screen.width, screen.height);
    context.globalCompositeOperation = "lighter";
  };

  /**
   * Draws rings
   */
  const drawRings = () => {
    if (!context) return;

    for (let i = 0; i < settings.ringCount; i++) {
      let currX = midX[i];
      let currY = midY[i];
      let currRad = rad[i];
      let dx = currX + invX;
      let dy = currY + invY;
      let s = 1 / (dx * dx + dy * dy - currRad * currRad);

      // Add bounds checking to prevent division by zero or invalid values
      if (isNaN(s) || !isFinite(s) || s <= 0) {
        continue; // Skip this ring if calculation is invalid
      }

      let ix = dx * s + currX * flag;
      let iy = -dy * s + currY * flag;
      let irad = currRad * s;

      // Ensure radius is positive and within reasonable bounds
      if (irad <= 0 || irad > 1000) {
        continue; // Skip this ring if radius is invalid
      }

      // Apply pulse effect if enabled
      let pulseMultiplier = 1;
      if (settings.enablePulse) {
        pulseMultiplier = 1 + Math.sin(pulsePhase) * 0.1;
        pulsePhase += settings.pulseSpeed * settings.speed;
      }

      let g = context.createRadialGradient(
        ix * settings.scale + screen.width / 2,
        iy * settings.scale + screen.height / 2,
        Math.max(0.1, irad * pulseMultiplier),
        ix * settings.scale + screen.width / 2,
        iy * settings.scale + screen.height / 2,
        Math.max(0.2, irad * settings.scale * pulseMultiplier)
      );

      let glowAlpha = settings.enableGlow ? settings.glowIntensity : 1;
      g.addColorStop(0, `hsla(176, 95%, 95%, ${glowAlpha})`);
      g.addColorStop(0.5, `hsla(201, 95%, 45%, ${0.5 * glowAlpha})`);
      g.addColorStop(1, "hsla(0, 0%, 0%, 0)");
      context.fillStyle = g;
      context.beginPath();
      context.arc(ix * settings.scale + screen.width / 2, iy * settings.scale + screen.height / 2, irad * settings.scale * pulseMultiplier, 0, Math.PI * 2.0, true);
      context.fill();
    }
  };

  /**
   * Updates inverse kinematics
   */
  const updateInverseKinematics = () => {
    if (!settings.enableMouseInteraction) {
      invX = 0;
      invY = 0;
      _mouseX = 0;
      _mouseY = 0;
      _invX = 0;
      _invY = 0;
      return;
    }

    invX = mouseX;
    invY = mouseY;
    _mouseX += (_invX - invX) * settings.spring;
    _mouseY += (_invY - invY) * settings.spring;
    _mouseX *= settings.friction;
    _mouseY *= settings.friction;
    _invX = invX;
    _invY = invY;
    invX += _mouseX;
    invY += _mouseY;

    // Add bounds checking to prevent extreme values
    invX = Math.max(-10, Math.min(10, invX));
    invY = Math.max(-10, Math.min(10, invY));
    _mouseX = Math.max(-5, Math.min(5, _mouseX));
    _mouseY = Math.max(-5, Math.min(5, _mouseY));
  };

  /**
   * Initializes the interstellar animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeInterstellar = (newSettings = null) => {
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

    // Initialize rings
    let radi = (Math.PI * 2.0) / settings.ringCount;
    midX = [];
    midY = [];
    rad = [];
    for (let i = 0; i < settings.ringCount; i++) {
      midX[i] = Math.cos(radi * i);
      midY[i] = Math.sin(radi * i);
      rad[i] = 0.1;
    }

    // Initialize stars
    stars = [];
    for (let j = 0; j < settings.starCount; j++) {
      stars[j] = createStar();
      resetStar(stars[j]);
    }

    // Reset mouse and inverse kinematics variables
    mouseX = 0;
    mouseY = 0;
    _mouseX = 0;
    _mouseY = 0;
    invX = 0;
    invY = 0;
    _invX = 0;
    _invY = 0;
    flag = 1;
    pulsePhase = 0;

    // Remove old event listeners if they exist
    if (eventHandlers) {
      document.removeEventListener("mousemove", eventHandlers.mouseMove);
      document.removeEventListener("touchmove", eventHandlers.touchMove);
      eventHandlers = null;
    }

    // Add mouse event listeners if enabled
    if (settings.enableMouseInteraction) {
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - screen.width / 2) / settings.scale;
        mouseY = (e.clientY - rect.top - screen.height / 2) / settings.scale;
      };

      const handleTouchMove = (e) => {
        if (e.touches && e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          const touch = e.touches[0];
          mouseX = (touch.clientX - rect.left - screen.width / 2) / settings.scale;
          mouseY = (touch.clientY - rect.top - screen.height / 2) / settings.scale;
        }
      };

      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("touchmove", handleTouchMove, { passive: false });

      // Store event handlers for cleanup
      eventHandlers = {
        mouseMove: handleMouseMove,
        touchMove: handleTouchMove,
      };
    }
  };

  /**
   * Main render function
   */
  const render = () => {
    if (!context || !canvas) return;

    const currentTime = performance.now();
    animationId = requestAnimationFrame(render);

    // Draw background first
    drawBackground();

    // Update inverse kinematics
    updateInverseKinematics();

    // Draw fill and text
    fill();
    drawText();

    // Draw rings
    drawRings();

    // Draw stars
    for (let j = 0; j < stars.length; j++) {
      fadeStar(stars[j]);
      animateStar(stars[j]);
      drawStar(stars[j]);
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
        initializeInterstellar();
        // Restart animation
        render();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeInterstellar();
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

    // Remove mouse event listeners if they exist
    if (eventHandlers) {
      document.removeEventListener("mousemove", eventHandlers.mouseMove);
      document.removeEventListener("touchmove", eventHandlers.touchMove);
      eventHandlers = null;
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
    stars = [];
    midX = [];
    midY = [];
    rad = [];
    context = null;
    canvas = null;
    screen = { width: 0, height: 0 };
  };

  return {
    start,
    clean,
  };
}
