// Default settings optimized for performance
const defaultSettings = Object.freeze({
  backgroundColor: "#0f0f23",
  backgroundImage: null,
  speed: 1,
  circleColor: "#27ae60",
  maxCircles: 80,
  spawnInterval: 80,
  expansionDuration: 1500,
  maxRadius: 15,
  minRadius: 0,
  initialOpacity: 0.8,
  enableRandomColors: false,
  colorPalette: ["#27ae60", "#3498db", "#e74c3c", "#f39c12", "#9b59b6"],
});

export default function ExpandingCirclesPlugin(canvasElement, animationSettings = {}) {
  let canvas;
  let context;
  let circles = [];
  let animationId = null;
  let lastFrame = 0;
  let lastCircleTime = 0;
  let backgroundImage = null;
  let screen = { width: 0, height: 0 };
  let settings = { ...defaultSettings, ...animationSettings };

  // Constants for performance
  const TWO_PI = 2 * Math.PI;

  // Cache all settings for performance (calculated once during initialization)
  let cachedMinRadius = defaultSettings.minRadius;
  let cachedMaxRadius = defaultSettings.maxRadius;
  let cachedInitialOpacity = defaultSettings.initialOpacity;
  let cachedSpawnInterval = defaultSettings.spawnInterval;
  let cachedMaxCircles = defaultSettings.maxCircles;
  let cachedExpansionDuration = defaultSettings.expansionDuration;
  let cachedCircleColor = defaultSettings.circleColor;
  let cachedEnableRandomColors = defaultSettings.enableRandomColors;
  let cachedColorPalette = defaultSettings.colorPalette;
  let cachedBackgroundColor = defaultSettings.backgroundColor;

  // Update cached settings (called during initialization)
  const updateCachedSettings = () => {
    cachedMinRadius = settings.minRadius ?? defaultSettings.minRadius;
    cachedMaxRadius = settings.maxRadius ?? defaultSettings.maxRadius;
    cachedInitialOpacity = settings.initialOpacity ?? defaultSettings.initialOpacity;
    cachedSpawnInterval = settings.spawnInterval ?? defaultSettings.spawnInterval;
    cachedMaxCircles = settings.maxCircles ?? defaultSettings.maxCircles;
    cachedExpansionDuration = settings.expansionDuration ?? defaultSettings.expansionDuration;
    cachedCircleColor = settings.circleColor ?? defaultSettings.circleColor;
    cachedEnableRandomColors = settings.enableRandomColors ?? defaultSettings.enableRandomColors;
    cachedColorPalette = settings.colorPalette ?? defaultSettings.colorPalette;
    cachedBackgroundColor = settings.backgroundColor ?? defaultSettings.backgroundColor;
  };

  // Create a single expanding circle (optimized with cached settings)
  const createCircle = (x, y) => {
    const startTime = performance.now();

    // Random color if enabled (using cached values)
    let color = cachedCircleColor;
    if (cachedEnableRandomColors && cachedColorPalette.length > 0) {
      color = cachedColorPalette[Math.floor(Math.random() * cachedColorPalette.length)];
    }

    return {
      x,
      y,
      radius: cachedMinRadius,
      opacity: cachedInitialOpacity,
      startTime,
      duration: cachedExpansionDuration,
      color,
    };
  };

  // Update circle animation (optimized with cached settings)
  const updateCircle = (circle, currentTime) => {
    const elapsed = currentTime - circle.startTime;
    const progress = Math.min(elapsed / circle.duration, 1);

    // Update radius (linear expansion) - using cached values
    circle.radius = cachedMinRadius + (cachedMaxRadius - cachedMinRadius) * progress;

    // Update opacity (linear fade out) - using cached values
    circle.opacity = cachedInitialOpacity * (1 - progress);

    // Return true if animation is complete
    return progress >= 1;
  };

  // Draw a single circle (optimized)
  const drawCircle = (circle) => {
    const { x, y, radius, opacity, color } = circle;

    // Skip drawing if radius is invalid
    if (radius <= 0 || opacity <= 0) return;

    context.save();
    context.globalAlpha = opacity;
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, TWO_PI);
    context.fill();
    context.restore();
  };

  // Spawn a new circle at random position (optimized with cached settings)
  const spawnCircle = () => {
    // Generate random position
    const x = Math.random() * screen.width;
    const y = Math.random() * screen.height;

    // Create new circle
    circles.push(createCircle(x, y));

    // Remove old circles if we exceed the maximum count (using cached value)
    if (circles.length > cachedMaxCircles) {
      circles.shift();
    }
  };

  // Draw background (optimized)
  const drawBackground = () => {
    if (backgroundImage && backgroundImage.complete) {
      context.drawImage(backgroundImage, 0, 0, screen.width, screen.height);
    } else {
      // Create solid background (using cached color)
      context.fillStyle = cachedBackgroundColor;
      context.fillRect(0, 0, screen.width, screen.height);
    }
  };

  // Initialize the expanding circles animation
  const initializeExpandingCircles = () => {
    canvas = canvasElement;

    // Validate canvas element
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    context = canvas.getContext("2d");

    // Validate context
    if (!context) {
      return;
    }

    // Update all cached settings
    updateCachedSettings();

    // Ensure radius values are always positive
    cachedMinRadius = Math.max(0, cachedMinRadius);
    cachedMaxRadius = Math.max(cachedMinRadius, cachedMaxRadius);
    settings.minRadius = cachedMinRadius;
    settings.maxRadius = cachedMaxRadius;

    // Get the actual canvas dimensions from the element
    const rect = canvas.getBoundingClientRect();

    // Use canvas element dimensions directly (width/height removed from settings)
    screen = {
      width: Math.max(1, Math.floor(rect.width) || 800),
      height: Math.max(1, Math.floor(rect.height) || 400),
    };

    // Set canvas dimensions to match the element size
    canvas.width = screen.width;
    canvas.height = screen.height;

    // Load background image if provided (optimized)
    const bgImage = settings.backgroundImage;
    if (bgImage) {
      backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.onload = () => {
        // Background image loaded successfully
      };
      backgroundImage.onerror = () => {
        backgroundImage = null;
      };
      backgroundImage.src = bgImage;
    } else {
      backgroundImage = null;
    }

    // Initialize timing
    lastFrame = 0;
    lastCircleTime = performance.now();
    circles = [];
  };

  // Main render function (optimized)
  const render = (currentTime) => {
    lastFrame = currentTime;
    animationId = requestAnimationFrame(render);

    // Draw background
    drawBackground();

    // Spawn new circles at intervals (using cached interval)
    if (currentTime - lastCircleTime >= cachedSpawnInterval) {
      spawnCircle();
      lastCircleTime = currentTime;
    }

    // Update and draw circles (optimized loop)
    const circlesLen = circles.length;
    for (let i = circlesLen - 1; i >= 0; i--) {
      const circle = circles[i];
      if (updateCircle(circle, currentTime)) {
        circles.splice(i, 1);
      } else {
        drawCircle(circle);
      }
    }
  };

  // Handle window resize
  const onResize = () => {
    initializeExpandingCircles();
  };

  // Start the animation
  const start = () => {
    initializeExpandingCircles();
    render(performance.now());
    window.addEventListener("resize", onResize);
  };

  // Clean up the animation
  const clean = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener("resize", onResize);

    if (context) {
      context.clearRect(0, 0, screen.width, screen.height);
    }

    circles = [];
  };

  return { start, clean };
}
