/**
 * Geometric Animation Plugin
 * Creates animated geometric shapes with customizable settings
 *
 * Uses unique namespace prefix "salameh-geo-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#1a1a2e",
  backgroundImage: null,
  count: 40,
  types: ["square", "circle", "triangle", "rectangle"],
  colors: ["#f72585", "#4cc9f0", "#7209b7", "#4361ee"],
  speed: 1,
  enableMouseInteraction: true,
  mouseSensitivity: 0.05,
  enableParticles: true,
  particleCount: 100,
  enableGradientOverlay: true,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-geo-";

// Style sheet ID for tracking
const STYLE_SHEET_ID = `${NAMESPACE_PREFIX}styles`;

// Animation names with unique namespace
const ANIMATION_NAMES = {
  rotate: `${NAMESPACE_PREFIX}rotate`,
  pulse: `${NAMESPACE_PREFIX}pulse`,
  float: `${NAMESPACE_PREFIX}float`,
  slide: `${NAMESPACE_PREFIX}slide`,
  sparkle: `${NAMESPACE_PREFIX}sparkle`,
  pulseOverlay: `${NAMESPACE_PREFIX}pulse-overlay`,
};

// Class names with unique namespace
const CLASS_NAMES = {
  container: `${NAMESPACE_PREFIX}container`,
  backgroundImage: `${NAMESPACE_PREFIX}background-image`,
  geometricBackground: `${NAMESPACE_PREFIX}geometric-background`,
  shape: `${NAMESPACE_PREFIX}shape`,
  square: `${NAMESPACE_PREFIX}square`,
  circle: `${NAMESPACE_PREFIX}circle`,
  triangle: `${NAMESPACE_PREFIX}triangle`,
  rectangle: `${NAMESPACE_PREFIX}rectangle`,
  particlesContainer: `${NAMESPACE_PREFIX}particles-container`,
  particle: `${NAMESPACE_PREFIX}particle`,
  gradientOverlay: `${NAMESPACE_PREFIX}gradient-overlay`,
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
 * Validates array of colors
 * @param {Array} colors - Array of color strings
 * @param {Array} defaultValue - Default array if invalid
 * @returns {Array} Validated array
 */
const validateColorArray = (colors, defaultValue) => {
  if (!Array.isArray(colors) || colors.length === 0) {
    return defaultValue;
  }
  return colors.map((color) => validateColor(color, defaultValue[0])).filter(Boolean);
};

/**
 * Validates array of shape types
 * @param {Array} types - Array of shape type strings
 * @param {Array} defaultValue - Default array if invalid
 * @returns {Array} Validated array
 */
const validateTypeArray = (types, defaultValue) => {
  const validTypes = ["square", "circle", "triangle", "rectangle"];
  if (!Array.isArray(types) || types.length === 0) {
    return defaultValue;
  }
  return types.filter((type) => validTypes.includes(type)).length > 0 ? types.filter((type) => validTypes.includes(type)) : defaultValue;
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
    types: validateTypeArray(settings.types, defaultSettings.types),
    colors: validateColorArray(settings.colors, defaultSettings.colors),
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
    enableMouseInteraction: Boolean(settings.enableMouseInteraction !== false),
    mouseSensitivity: validateNumber(settings.mouseSensitivity, defaultSettings.mouseSensitivity, 0.01, 2.0),
    enableParticles: Boolean(settings.enableParticles !== false),
    particleCount: Math.max(0, Math.min(500, validateNumber(settings.particleCount, defaultSettings.particleCount, 0, 500))),
    enableGradientOverlay: Boolean(settings.enableGradientOverlay !== false),
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
  styleSheet.setAttribute("data-salameh-geo", "styles");
  styleSheet.textContent = `
    .${CLASS_NAMES.container} {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .${CLASS_NAMES.backgroundImage} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
      pointer-events: none;
    }

    .${CLASS_NAMES.geometricBackground} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 2;
      pointer-events: none;
    }

    .${CLASS_NAMES.shape} {
      position: absolute;
      opacity: 0.2;
      transform-origin: center;
    }

    .${CLASS_NAMES.square} {
      width: 40px;
      height: 40px;
      animation: ${ANIMATION_NAMES.rotate} 20s infinite linear;
    }

    .${CLASS_NAMES.circle} {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      animation: ${ANIMATION_NAMES.pulse} 15s infinite alternate;
    }

    .${CLASS_NAMES.triangle} {
      width: 0;
      height: 0;
      border-left: 25px solid transparent;
      border-right: 25px solid transparent;
      border-bottom: 50px solid;
      animation: ${ANIMATION_NAMES.float} 12s infinite ease-in-out;
    }

    .${CLASS_NAMES.rectangle} {
      width: 80px;
      height: 30px;
      animation: ${ANIMATION_NAMES.slide} 18s infinite linear;
    }

    .${CLASS_NAMES.particlesContainer} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .${CLASS_NAMES.particle} {
      position: absolute;
      width: 2px;
      height: 2px;
      background-color: white;
      opacity: 0.5;
      animation: ${ANIMATION_NAMES.sparkle} 8s infinite linear;
    }

    .${CLASS_NAMES.gradientOverlay} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, transparent 0%, rgba(26, 26, 46, 0.8) 80%);
      z-index: 3;
      pointer-events: none;
      animation: ${ANIMATION_NAMES.pulseOverlay} 10s infinite alternate;
    }

    @keyframes ${ANIMATION_NAMES.rotate} {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes ${ANIMATION_NAMES.pulse} {
      0% {
        transform: scale(1);
        opacity: 0.1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.3;
      }
      100% {
        transform: scale(1);
        opacity: 0.1;
      }
    }

    @keyframes ${ANIMATION_NAMES.float} {
      0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) translateX(20px) rotate(180deg);
      }
      100% {
        transform: translateY(0px) translateX(0px) rotate(360deg);
      }
    }

    @keyframes ${ANIMATION_NAMES.slide} {
      0% {
        transform: translateX(-100px) rotate(0deg);
      }
      50% {
        transform: translateX(100px) rotate(180deg);
      }
      100% {
        transform: translateX(-100px) rotate(360deg);
      }
    }

    @keyframes ${ANIMATION_NAMES.sparkle} {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes ${ANIMATION_NAMES.pulseOverlay} {
      0% {
        opacity: 0.8;
      }
      100% {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);
};

/**
 * Geometric Animation Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function GeometricAnimationPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let shapes = [];
  let particles = [];
  let animationId = null;
  let geometricBackground = null;
  let particlesContainer = null;
  let backgroundImage = null;
  let gradientOverlay = null;
  let mouseInteraction = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Random number generator
  const randomNumFrom = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Random array item selector
  const randomArrayItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  /**
   * Creates a single shape
   * @param {number} x - X position percentage
   * @param {number} y - Y position percentage
   * @param {string} type - Shape type
   * @param {number} index - Shape index
   * @returns {Object} Shape object with element and update method
   */
  const createShape = (x, y, type, index) => {
    const originalX = x;
    const originalY = y;
    const speedMultiplier = settings.speed || 1;
    const animationDelay = Math.random() * 10;
    const baseDuration = type === "square" ? 20 : type === "circle" ? 15 : type === "triangle" ? 12 : 18;
    const animationDuration = baseDuration / speedMultiplier + Math.random() * 10;

    const element = document.createElement("div");
    element.className = `${CLASS_NAMES.shape} ${CLASS_NAMES[type]}`;
    element.setAttribute("data-salameh-geo", "shape");
    element.setAttribute("data-salameh-geo-type", type);
    element.setAttribute("data-salameh-geo-index", index.toString());
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("role", "presentation");

    const color = randomArrayItem(settings.colors);
    if (type === "triangle") {
      element.style.borderBottomColor = color;
    } else {
      element.style.background = color;
    }

    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.animationDelay = `${animationDelay}s`;
    element.style.animationDuration = `${animationDuration}s`;

    const updateShape = (mouseX, mouseY) => {
      if (settings.enableMouseInteraction && element) {
        const sensitivity = Math.max(0.01, Math.min(2.0, settings.mouseSensitivity || 0.05));
        const targetX = originalX + (mouseX - 0.5) * sensitivity * 20;
        const targetY = originalY + (mouseY - 0.5) * sensitivity * 20;

        x += (targetX - x) * 0.1;
        y += (targetY - y) * 0.1;

        element.style.left = `${Math.max(0, Math.min(100, x))}%`;
        element.style.top = `${Math.max(0, Math.min(100, y))}%`;
      }
    };

    return {
      x,
      y,
      type,
      index,
      element,
      originalX,
      originalY,
      update: updateShape,
    };
  };

  /**
   * Creates a single particle
   * @param {number} x - X position percentage
   * @param {number} y - Y position percentage
   * @param {number} index - Particle index
   * @returns {Object} Particle object with element
   */
  const createParticle = (x, y, index) => {
    const speedMultiplier = settings.speed || 1;
    const animationDelay = Math.random() * 8;
    const animationDuration = (Math.random() * 4 + 4) / speedMultiplier;

    const element = document.createElement("div");
    element.className = CLASS_NAMES.particle;
    element.setAttribute("data-salameh-geo", "particle");
    element.setAttribute("data-salameh-geo-index", index.toString());
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("role", "presentation");

    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.animationDelay = `${animationDelay}s`;
    element.style.animationDuration = `${animationDuration}s`;

    return {
      x,
      y,
      index,
      element,
    };
  };

  /**
   * Creates all shapes
   */
  const createShapes = () => {
    shapes = [];
    for (let i = 0; i < settings.count; i++) {
      const shapeType = randomArrayItem(settings.types);
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      const shape = createShape(posX, posY, shapeType, i);
      if (geometricBackground) {
        geometricBackground.appendChild(shape.element);
      }
      shapes.push(shape);
    }
  };

  /**
   * Creates all particles
   */
  const createParticles = () => {
    particles = [];
    if (!settings.enableParticles || !particlesContainer) return;

    for (let i = 0; i < settings.particleCount; i++) {
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      const particle = createParticle(posX, posY, i);
      particlesContainer.appendChild(particle.element);
      particles.push(particle);
    }
  };

  /**
   * Creates background image if provided
   * @returns {HTMLElement|null} Background image element
   */
  const createBackgroundImage = () => {
    if (!settings.backgroundImage) return null;

    const bgImage = document.createElement("div");
    bgImage.className = CLASS_NAMES.backgroundImage;
    bgImage.setAttribute("data-salameh-geo", "background-image");
    bgImage.style.backgroundImage = `url(${settings.backgroundImage})`;
    bgImage.setAttribute("aria-hidden", "true");
    bgImage.setAttribute("role", "presentation");

    bgImage.onerror = function () {
      bgImage.style.display = "none";
    };

    return bgImage;
  };

  /**
   * Creates gradient overlay
   * @returns {HTMLElement|null} Gradient overlay element
   */
  const createGradientOverlay = () => {
    if (!settings.enableGradientOverlay) return null;

    const overlay = document.createElement("div");
    overlay.className = CLASS_NAMES.gradientOverlay;
    overlay.setAttribute("data-salameh-geo", "gradient-overlay");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "presentation");

    return overlay;
  };

  /**
   * Adds mouse interaction handlers
   * @returns {Object|null} Mouse interaction object
   */
  const addMouseInteraction = () => {
    if (!settings.enableMouseInteraction) return null;

    const interaction = {
      mouseX: 0.5,
      mouseY: 0.5,
      mouseMoveHandler: null,
      touchMoveHandler: null,
    };

    interaction.mouseMoveHandler = (e) => {
      interaction.mouseX = e.clientX / window.innerWidth;
      interaction.mouseY = e.clientY / window.innerHeight;
    };

    interaction.touchMoveHandler = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        interaction.mouseX = touch.clientX / window.innerWidth;
        interaction.mouseY = touch.clientY / window.innerHeight;
      }
    };

    document.addEventListener("mousemove", interaction.mouseMoveHandler, { passive: true });
    document.addEventListener("touchmove", interaction.touchMoveHandler, { passive: false });

    return interaction;
  };

  /**
   * Initializes the geometric animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeGeometric = (newSettings = null) => {
    if (!container) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Clean up existing elements
    const existingBackground = container.querySelector(`.${CLASS_NAMES.geometricBackground}`);
    if (existingBackground && existingBackground.parentNode === container) {
      existingBackground.remove();
    }

    const existingParticles = container.querySelector(`.${CLASS_NAMES.particlesContainer}`);
    if (existingParticles && existingParticles.parentNode === container) {
      existingParticles.remove();
    }

    const existingBgImage = container.querySelector(`.${CLASS_NAMES.backgroundImage}`);
    if (existingBgImage && existingBgImage.parentNode === container) {
      existingBgImage.remove();
    }

    const existingOverlay = container.querySelector(`.${CLASS_NAMES.gradientOverlay}`);
    if (existingOverlay && existingOverlay.parentNode === container) {
      existingOverlay.remove();
    }

    // Ensure container has required styles
    if (container.style.position !== "relative") {
      container.style.position = "relative";
    }
    if (container.style.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }

    // Set background color
    container.style.background = settings.backgroundImage ? "transparent" : settings.backgroundColor;

    // Inject animation styles
    injectAnimationStyles();

    // Create background image
    backgroundImage = createBackgroundImage();
    if (backgroundImage) {
      container.appendChild(backgroundImage);
    }

    // Create geometric background container
    geometricBackground = document.createElement("div");
    geometricBackground.className = CLASS_NAMES.geometricBackground;
    geometricBackground.setAttribute("data-salameh-geo", "geometric-background");
    geometricBackground.setAttribute("aria-hidden", "true");
    container.appendChild(geometricBackground);

    // Create particles container
    if (settings.enableParticles) {
      particlesContainer = document.createElement("div");
      particlesContainer.className = CLASS_NAMES.particlesContainer;
      particlesContainer.setAttribute("data-salameh-geo", "particles-container");
      particlesContainer.setAttribute("aria-hidden", "true");
      container.appendChild(particlesContainer);
    }

    // Create gradient overlay
    gradientOverlay = createGradientOverlay();
    if (gradientOverlay) {
      container.appendChild(gradientOverlay);
    }

    // Initialize shapes and particles
    createShapes();
    createParticles();
  };

  /**
   * Main render function
   */
  const render = () => {
    animationId = requestAnimationFrame(render);

    // Update shapes for mouse interaction
    if (mouseInteraction && settings.enableMouseInteraction) {
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].update(mouseInteraction.mouseX, mouseInteraction.mouseY);
      }
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
        initializeGeometric();
        // Restart animation
        render();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeGeometric();
    mouseInteraction = addMouseInteraction();
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

    // Remove mouse interaction listeners
    if (mouseInteraction) {
      if (mouseInteraction.mouseMoveHandler) {
        document.removeEventListener("mousemove", mouseInteraction.mouseMoveHandler);
      }
      if (mouseInteraction.touchMoveHandler) {
        document.removeEventListener("touchmove", mouseInteraction.touchMoveHandler);
      }
      mouseInteraction = null;
    }

    // Remove all created elements
    if (container) {
      try {
        const existingBackground = container.querySelector(`.${CLASS_NAMES.geometricBackground}`);
        if (existingBackground && existingBackground.parentNode === container) {
          existingBackground.remove();
        }

        const existingParticles = container.querySelector(`.${CLASS_NAMES.particlesContainer}`);
        if (existingParticles && existingParticles.parentNode === container) {
          existingParticles.remove();
        }

        const existingBgImage = container.querySelector(`.${CLASS_NAMES.backgroundImage}`);
        if (existingBgImage && existingBgImage.parentNode === container) {
          existingBgImage.remove();
        }

        const existingOverlay = container.querySelector(`.${CLASS_NAMES.gradientOverlay}`);
        if (existingOverlay && existingOverlay.parentNode === container) {
          existingOverlay.remove();
        }
      } catch (error) {
      }
    }

    // Clean up references
    shapes = [];
    particles = [];
    geometricBackground = null;
    particlesContainer = null;
    backgroundImage = null;
    gradientOverlay = null;
    container = null;
  };

  return {
    start,
    clean,
  };
}
