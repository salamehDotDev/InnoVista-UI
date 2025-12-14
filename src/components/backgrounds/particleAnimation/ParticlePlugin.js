/**
 * Particle Animation Plugin
 * Creates animated particles with connections using canvas
 *
 * Uses unique namespace prefix "salameh-part-" for all class names and IDs
 * to prevent conflicts with user's existing CSS classes.
 */

const defaultSettings = Object.freeze({
  backgroundColor: "#2c3e50",
  color: "#e74c3c",
  speed: 2,
  count: 30,
  size: 5,
  opacity: 0.9,
  connectionDistance: 150,
  showConnections: true,
  connectionColor: "#3498db",
  connectionOpacity: 0.8,
  image: null,
  imageWidth: 20,
  imageHeight: 20,
});

// Unique namespace prefix to avoid class name conflicts
const NAMESPACE_PREFIX = "salameh-part-";

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
    color: validateColor(settings.color, defaultSettings.color),
    speed: Math.max(0.1, Math.min(10, validateNumber(settings.speed, defaultSettings.speed, 0.1, 10))),
    count: Math.max(1, Math.min(200, validateNumber(settings.count, defaultSettings.count, 1, 200))),
    size: Math.max(1, Math.min(50, validateNumber(settings.size, defaultSettings.size, 1, 50))),
    opacity: Math.max(0, Math.min(1, validateNumber(settings.opacity, defaultSettings.opacity, 0, 1))),
    connectionDistance: Math.max(0, Math.min(500, validateNumber(settings.connectionDistance, defaultSettings.connectionDistance, 0, 500))),
    showConnections: Boolean(settings.showConnections !== false),
    connectionColor: validateColor(settings.connectionColor, defaultSettings.connectionColor),
    connectionOpacity: Math.max(0, Math.min(1, validateNumber(settings.connectionOpacity, defaultSettings.connectionOpacity, 0, 1))),
    image: settings.image || null,
    imageWidth: Math.max(1, Math.min(200, validateNumber(settings.imageWidth, defaultSettings.imageWidth, 1, 200))),
    imageHeight: Math.max(1, Math.min(200, validateNumber(settings.imageHeight, defaultSettings.imageHeight, 1, 200))),
  };
};

/**
 * Particle Animation Plugin
 * @param {HTMLCanvasElement} canvasElement - Canvas element for rendering
 * @param {Object} animationSettings - Animation configuration settings
 * @returns {Object} Plugin API with start and clean methods
 */
export default function ParticlePlugin(canvasElement, animationSettings = {}) {
  if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
    console.error("ParticlePlugin: Invalid canvas element provided");
    return {
      start: () => {},
      clean: () => {},
    };
  }

  let canvas = canvasElement;
  let context = null;
  let screen = { width: 0, height: 0 };
  let particles = [];
  let animationId = null;
  let particleImage = null;
  let settings = normalizeSettings({ ...defaultSettings, ...animationSettings });
  let resizeHandler = null;
  let resizeTimeout = null;

  // Mark canvas with data attribute
  canvas.setAttribute("data-salameh-part", "canvas");
  canvas.setAttribute(CANVAS_DATA_ATTR, "true");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  /**
   * Creates a single particle
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {number} size - Particle size
   * @param {string} color - Particle color
   * @param {number} speed - Particle speed
   * @returns {Object} Particle object
   */
  const createParticle = (x, y, size, color, speed) => {
    return {
      x: x,
      y: y,
      size: size,
      color: color,
      speed: speed,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.5 + 0.5,
      image: null,
    };
  };

  /**
   * Draws a particle
   * @param {Object} particle - Particle object to draw
   */
  const drawParticle = (particle) => {
    if (!context) return;

    context.save();
    context.globalAlpha = particle.opacity * settings.opacity;

    if (settings.image && particle.image && particle.image.complete && particle.image.naturalWidth > 0) {
      // Draw image if it's loaded successfully
      try {
        context.drawImage(particle.image, particle.x - settings.imageWidth / 2, particle.y - settings.imageHeight / 2, settings.imageWidth, settings.imageHeight);
      } catch (error) {
        // Fallback to circle if image draw fails
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    } else {
      // Draw circle as fallback
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  };

  /**
   * Updates a particle position and draws it
   * @param {Object} particle - Particle object to update
   */
  const updateParticle = (particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off edges
    if (particle.x <= 0 || particle.x >= screen.width) {
      particle.vx = -particle.vx;
    }
    if (particle.y <= 0 || particle.y >= screen.height) {
      particle.vy = -particle.vy;
    }

    // Keep particles within bounds
    particle.x = Math.max(0, Math.min(screen.width, particle.x));
    particle.y = Math.max(0, Math.min(screen.height, particle.y));

    drawParticle(particle);
  };

  /**
   * Draws connections between particles
   */
  const drawConnections = () => {
    if (!context || !settings.showConnections) return;

    context.strokeStyle = settings.connectionColor;
    context.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < settings.connectionDistance) {
          const opacity = (1 - distance / settings.connectionDistance) * settings.connectionOpacity;
          context.save();
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.stroke();
          context.restore();
        }
      }
    }
  };

  /**
   * Draws background
   */
  const drawBackground = () => {
    if (!context) return;

    if (settings.backgroundColor === "transparent") {
      context.clearRect(0, 0, screen.width, screen.height);
    } else {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  /**
   * Initializes the particle animation
   */
  const initializeParticles = () => {
    if (!canvas) return;

    context = canvas.getContext("2d", { alpha: settings.backgroundColor === "transparent" });

    if (!context) {
      console.error("ParticlePlugin: Could not get 2D context from canvas");
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

    // Load particle image if provided
    if (settings.image) {
      if (particleImage) {
        // Clean up previous image
        particleImage.onload = null;
        particleImage.onerror = null;
      }

      particleImage = new Image();
      particleImage.crossOrigin = "anonymous";
      particleImage.onload = function () {
        // Image loaded successfully, particles will use it
      };
      particleImage.onerror = function () {
        // Image failed to load, particles will use circles
        particleImage = null;
      };
      particleImage.src = settings.image;
    } else {
      particleImage = null;
    }

    // Initialize particles
    particles = [];
    for (let i = 0; i < settings.count; i++) {
      const x = Math.random() * screen.width;
      const y = Math.random() * screen.height;
      const particle = createParticle(x, y, settings.size, settings.color, settings.speed);
      particle.image = particleImage;
      particles.push(particle);
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

    // Draw connections first (behind particles)
    drawConnections();

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
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
        initializeParticles();
      }
    }, 150);
  };

  /**
   * Starts the animation
   */
  const start = () => {
    initializeParticles();
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

    // Clean up particle image
    if (particleImage) {
      particleImage.onload = null;
      particleImage.onerror = null;
      particleImage = null;
    }

    // Clear canvas
    if (context && screen) {
      context.clearRect(0, 0, screen.width, screen.height);
    }

    // Clean up references
    particles = [];
    context = null;
    screen = { width: 0, height: 0 };
  };

  return {
    start,
    clean,
  };
}
