/**
 * Floating Particles Animation Plugin
 * Creates animated floating particles with customizable settings
 *
 * Uses unique namespace prefix "salameh-fp-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#021027",
  backgroundImage: null,
  count: 100,
  size: 8,
  opacity: 0.8,
  duration: 15000,
  delay: 2000,
  enableFade: true,
  enableScale: true,
  enableBlendMode: true,
  blendMode: "screen",
  scaleRange: [0.4, 2.2],
  fadeDuration: 200,
  scaleDuration: 2000,
  enableBackgroundImage: true,
  enableMask: true,
  maskGradient: "radial-gradient(white 0%, white 30%, transparent 80%, transparent)",
  speed: 1,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-fp-";

// Style sheet ID for tracking
const STYLE_SHEET_ID = `${NAMESPACE_PREFIX}styles`;
const KEYFRAMES_STYLE_ID = `${NAMESPACE_PREFIX}keyframes`;

// Class names with unique namespace
const CLASS_NAMES = {
  container: `${NAMESPACE_PREFIX}container`,
  particlesContainer: `${NAMESPACE_PREFIX}particles-container`,
  particleContainer: `${NAMESPACE_PREFIX}particle-container`,
  particleCircle: `${NAMESPACE_PREFIX}particle-circle`,
  backgroundImage: `${NAMESPACE_PREFIX}background-image`,
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
 * Validates array of numbers
 * @param {Array} value - Array to validate
 * @param {Array} defaultValue - Default array if invalid
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {Array} Validated array
 */
const validateNumberArray = (value, defaultValue, min = 0, max = Infinity) => {
  if (!Array.isArray(value) || value.length !== 2) {
    return defaultValue;
  }
  return [
    Math.max(min, Math.min(max, validateNumber(value[0], defaultValue[0], min, max))),
    Math.max(min, Math.min(max, validateNumber(value[1], defaultValue[1], min, max))),
  ];
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
    count: Math.max(1, Math.min(500, validateNumber(settings.count, defaultSettings.count, 1, 500))),
    size: validateNumber(settings.size, defaultSettings.size, 1, 50),
    opacity: validateNumber(settings.opacity, defaultSettings.opacity, 0, 1),
    duration: validateNumber(settings.duration, defaultSettings.duration, 1000, 60000),
    delay: validateNumber(settings.delay, defaultSettings.delay, 0, 10000),
    enableFade: Boolean(settings.enableFade !== false),
    enableScale: Boolean(settings.enableScale !== false),
    enableBlendMode: Boolean(settings.enableBlendMode !== false),
    blendMode: validateColor(settings.blendMode, defaultSettings.blendMode),
    scaleRange: validateNumberArray(settings.scaleRange, defaultSettings.scaleRange, 0.1, 10),
    fadeDuration: validateNumber(settings.fadeDuration, defaultSettings.fadeDuration, 50, 5000),
    scaleDuration: validateNumber(settings.scaleDuration, defaultSettings.scaleDuration, 100, 10000),
    enableBackgroundImage: Boolean(settings.enableBackgroundImage !== false),
    enableMask: Boolean(settings.enableMask !== false),
    maskGradient: typeof settings.maskGradient === "string" ? settings.maskGradient : defaultSettings.maskGradient,
    speed: validateNumber(settings.speed, defaultSettings.speed, 0.1, 10),
  };
};

/**
 * Creates CSS styles if not already present
 */
const injectStyles = () => {
  if (document.getElementById(STYLE_SHEET_ID)) {
    return; // Styles already injected
  }

  const styleSheet = document.createElement("style");
  styleSheet.id = STYLE_SHEET_ID;
  styleSheet.setAttribute("data-salameh-fp", "styles");
  styleSheet.textContent = `
    .${CLASS_NAMES.container} {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .${CLASS_NAMES.particlesContainer} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;
    }

    .${CLASS_NAMES.particleContainer} {
      position: absolute;
      transform: translateY(-10vh);
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-fill-mode: both;
    }

    .${CLASS_NAMES.particleCircle} {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-image: radial-gradient(
        var(--salameh-fp-particle-color, hsl(180, 100%, 80%)),
        var(--salameh-fp-particle-color, hsl(180, 100%, 80%)) 10%,
        hsla(180, 100%, 80%, 0) 56%
      );
      animation-fill-mode: both;
    }

    .${CLASS_NAMES.backgroundImage} {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    @keyframes salameh-fp-fadein {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes salameh-fp-scale {
      0% {
        transform: scale3d(var(--salameh-fp-scale-min, 0.4), var(--salameh-fp-scale-min, 0.4), 1);
      }
      50% {
        transform: scale3d(var(--salameh-fp-scale-max, 2.2), var(--salameh-fp-scale-max, 2.2), 1);
      }
      100% {
        transform: scale3d(var(--salameh-fp-scale-min, 0.4), var(--salameh-fp-scale-min, 0.4), 1);
      }
    }
  `;
  document.head.appendChild(styleSheet);
};

/**
 * Floating Particles Animation Plugin
 * @param {HTMLElement} containerElement - Container element for the animation
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function FloatingParticlesPlugin(containerElement, animationSettings = {}) {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let container = containerElement;
  let particles = [];
  let animationId = null;
  let uniqueId = null;
  let particlesContainer = null;
  let backgroundImage = null;
  let keyframesStyle = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Generate unique ID for this instance
  const generateUniqueId = () => {
    return `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Random number generator
  const randomNumFrom = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Create a single particle
  const createParticle = (index) => {
    const size = Math.random() * settings.size;
    const startPositionY = Math.random() * 10 + 100;
    const endPositionY = -startPositionY - Math.random() * 30;
    const startPositionX = Math.random() * 100;
    const endPositionX = Math.random() * 100;
    const animationDuration = (settings.duration + Math.random() * 9000) / settings.speed;
    const animationDelay = Math.random() * settings.delay;
    const fadeDelay = Math.random() * 1000;

    const createParticleElement = () => {
      // Create particle container
      const element = document.createElement("div");
      element.className = CLASS_NAMES.particleContainer;
      element.setAttribute("data-salameh-fp", "particle-container");
      element.setAttribute("data-salameh-fp-index", index.toString());
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.animationDuration = `${animationDuration}ms`;
      element.style.animationDelay = `${animationDelay}ms`;
      element.style.animationName = `salameh-fp-move-${uniqueId}-${index}`;
      element.style.animationIterationCount = "infinite";
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("role", "presentation");

      // Create circle element
      const circleElement = document.createElement("div");
      circleElement.className = CLASS_NAMES.particleCircle;
      circleElement.setAttribute("data-salameh-fp", "particle-circle");
      circleElement.style.animationDelay = `${fadeDelay}ms`;

      // Apply animations if enabled
      if (settings.enableFade) {
        circleElement.style.animation = `salameh-fp-fadein ${settings.fadeDuration}ms infinite`;
      }
      if (settings.enableScale) {
        const scaleAnim = circleElement.style.animation || "";
        circleElement.style.animation = scaleAnim
          ? `${scaleAnim}, salameh-fp-scale ${settings.scaleDuration}ms infinite`
          : `salameh-fp-scale ${settings.scaleDuration}ms infinite`;
      }
      if (settings.enableBlendMode) {
        circleElement.style.mixBlendMode = settings.blendMode;
      }

      element.appendChild(circleElement);

      return element;
    };

    return {
      index,
      size,
      startPositionY,
      endPositionY,
      startPositionX,
      endPositionX,
      animationDuration,
      animationDelay,
      fadeDelay,
      createElement: createParticleElement,
    };
  };

  // Create all particles
  const createParticles = () => {
    particles = [];
    for (let i = 1; i <= settings.count; i++) {
      const particle = createParticle(i);
      const element = particle.createElement();
      particlesContainer.appendChild(element);
      particles.push(particle);
    }
  };

  // Generate keyframes for particle movement
  const generateKeyframes = () => {
    // Remove existing keyframes if any
    if (keyframesStyle && keyframesStyle.parentNode) {
      keyframesStyle.remove();
    }

    keyframesStyle = document.createElement("style");
    keyframesStyle.id = `${KEYFRAMES_STYLE_ID}-${uniqueId}`;
    keyframesStyle.setAttribute("data-salameh-fp", "keyframes");
    keyframesStyle.setAttribute("data-salameh-fp-id", uniqueId);

    let keyframesCSS = "";

    for (let i = 1; i <= settings.count; i++) {
      const particle = particles[i - 1];
      if (particle) {
        keyframesCSS += `
          @keyframes salameh-fp-move-${uniqueId}-${i} {
            from {
              transform: translate3d(${particle.startPositionX}vw, ${particle.startPositionY}vh, 0);
            }
            to {
              transform: translate3d(${particle.endPositionX}vw, ${particle.endPositionY}vh, 0);
            }
          }
        `;
      }
    }

    keyframesStyle.textContent = keyframesCSS;
    document.head.appendChild(keyframesStyle);
  };

  // Create background image if provided
  const createBackgroundImage = () => {
    if (!settings.backgroundImage || !settings.enableBackgroundImage) return null;

    const bgImage = document.createElement("img");
    bgImage.className = CLASS_NAMES.backgroundImage;
    bgImage.setAttribute("data-salameh-fp", "background-image");
    bgImage.src = settings.backgroundImage;
    bgImage.crossOrigin = "anonymous";
    bgImage.setAttribute("aria-hidden", "true");
    bgImage.setAttribute("role", "presentation");

    if (settings.enableMask) {
      bgImage.style.maskImage = settings.maskGradient;
      bgImage.style.webkitMaskImage = settings.maskGradient;
    }

    bgImage.onerror = function () {
      // Background image failed to load
      bgImage.style.display = "none";
    };

    container.appendChild(bgImage);
    return bgImage;
  };

  /**
   * Initializes the floating particles animation
   * @param {Object} newSettings - Optional new settings to apply
   */
  const initializeFloatingParticles = (newSettings = null) => {
    if (!container) return;

    // Update settings if provided
    if (newSettings) {
      settings = normalizeSettings({ ...defaultSettings, ...newSettings });
    }

    // Generate unique ID for this instance
    uniqueId = generateUniqueId();

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width) || 800);
    const height = Math.max(1, Math.floor(rect.height) || 400);

    // Clean up existing elements
    const existingParticles = container.querySelectorAll(`[data-salameh-fp="particles-container"]`);
    existingParticles.forEach((el) => {
      if (el.parentNode === container) {
        el.remove();
      }
    });

    const existingBgImage = container.querySelector(`.${CLASS_NAMES.backgroundImage}`);
    if (existingBgImage && existingBgImage.parentNode === container) {
      existingBgImage.remove();
    }

    // Ensure container has required styles
    if (container.style.position !== "relative") {
      container.style.position = "relative";
    }
    if (container.style.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }

    // Set background color
    container.style.background = settings.backgroundImage && settings.enableBackgroundImage ? "transparent" : settings.backgroundColor;

    // Inject base styles
    injectStyles();

    // Create particles container
    particlesContainer = document.createElement("div");
    particlesContainer.className = CLASS_NAMES.particlesContainer;
    particlesContainer.setAttribute("data-salameh-fp", "particles-container");
    particlesContainer.setAttribute("data-salameh-fp-id", uniqueId);
    particlesContainer.setAttribute("aria-hidden", "true");
    container.appendChild(particlesContainer);

    // Apply CSS custom properties for dynamic styling
    particlesContainer.style.setProperty("--salameh-fp-particle-size", `${settings.size}px`);
    particlesContainer.style.setProperty("--salameh-fp-particle-opacity", settings.opacity);
    particlesContainer.style.setProperty("--salameh-fp-blend-mode", settings.blendMode);
    particlesContainer.style.setProperty("--salameh-fp-scale-min", settings.scaleRange[0]);
    particlesContainer.style.setProperty("--salameh-fp-scale-max", settings.scaleRange[1]);
    particlesContainer.style.setProperty("--salameh-fp-fade-duration", `${settings.fadeDuration}ms`);
    particlesContainer.style.setProperty("--salameh-fp-scale-duration", `${settings.scaleDuration}ms`);

    // Create background image
    backgroundImage = createBackgroundImage();

    // Initialize particles
    createParticles();

    // Generate keyframes for particle movement
    generateKeyframes();
  };

  // Main render function (minimal since CSS handles animation)
  const render = () => {
    animationId = requestAnimationFrame(render);
    // CSS animations handle the actual rendering, this just keeps the loop alive
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
        initializeFloatingParticles();
        // Restart animation
        render();
      }
    }, 150); // Debounce resize events
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeFloatingParticles();
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

    // Remove keyframes
    if (keyframesStyle && keyframesStyle.parentNode) {
      try {
        keyframesStyle.remove();
      } catch (error) {
      }
      keyframesStyle = null;
    }

    // Remove particles container
    if (particlesContainer && particlesContainer.parentNode) {
      try {
        particlesContainer.remove();
      } catch (error) {
      }
      particlesContainer = null;
    }

    // Remove background image
    if (backgroundImage && backgroundImage.parentNode) {
      try {
        backgroundImage.remove();
      } catch (error) {
      }
      backgroundImage = null;
    }

    // Clean up references
    particles = [];
    container = null;
  };

  return {
    start,
    clean,
  };
}
