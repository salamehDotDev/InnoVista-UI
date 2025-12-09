// Default settings optimized for performance and ease of use
// These match the "normal" intensity preset by default
const defaultSettings = Object.freeze({
  backgroundColor: "#000000",
  backgroundImage: null,
  width: "auto",
  height: "auto",
  speed: 1,
  numBalls: 70, // Good balance between visual impact and performance
  colors: [
    "85, 221, 224,", // Cyan
    "51, 101, 138,", // Blue
    "47, 72, 88,", // Dark Blue
    "246, 174, 45,", // Orange
    "242, 100, 25,", // Red Orange
  ],
  minBallSize: 4, // Minimum ball size in pixels
  maxBallSize: 16, // Maximum ball size in pixels
  expansionRate: 0.1, // How fast balls expand (lower = slower)
  velocityRange: 4, // Movement speed range (lower = slower)
  enableMouseInteraction: false, // Disabled by default for better performance
  mouseForce: 0.5, // Mouse interaction strength (0-1)
  enableGlow: false, // Disabled by default for better performance
  glowIntensity: 0.3, // Glow effect intensity (0-1)
  enableTrails: false, // Disabled by default for better performance
  trailLength: 5, // Number of trail points
  trailOpacity: 0.2, // Trail opacity (0-1)
});

export default function ExpandingBallsPlugin(canvasElement, animationSettings = {}) {
  let canvas;
  let context;
  let screen;
  let balls = [];
  let animationId = null;
  let backgroundImage = null;
  let mouseX = 0;
  let mouseY = 0;
  let eventHandlers = null;
  let settings = { ...defaultSettings, ...animationSettings };

  // Pre-process colors to RGB format for better performance
  // This is done once during initialization for optimal performance
  const processedColors = settings.colors.map((color) => {
    if (color.includes(",")) return color; // Already in RGB format
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `${r}, ${g}, ${b},`;
    }
    return color;
  });

  // Get random color from pre-processed colors array
  const getRandomColor = () => {
    return processedColors[Math.floor(Math.random() * processedColors.length)];
  };

  // Create a single ball
  const createBall = () => {
    return {
      x: screen.width / 2,
      y: screen.height / 2,
      width: Math.floor(Math.random() * (settings.maxBallSize - settings.minBallSize)) + settings.minBallSize,
      color: "rgba(" + getRandomColor() + " " + Math.random() + ")",
      vx: Math.random() * settings.velocityRange * 2 - settings.velocityRange,
      vy: Math.random() * settings.velocityRange * 2 - settings.velocityRange,
      trail: [],
    };
  };

  // Reset a ball to center
  const resetBall = (ball) => {
    ball.x = screen.width / 2;
    ball.y = screen.height / 2;
    ball.width = Math.floor(Math.random() * (settings.maxBallSize - settings.minBallSize)) + settings.minBallSize;
    ball.vx = Math.random() * settings.velocityRange * 2 - settings.velocityRange;
    ball.vy = Math.random() * settings.velocityRange * 2 - settings.velocityRange;
    ball.trail = [];
  };

  // Constants for performance
  const TWO_PI = 2 * Math.PI;
  const GLOW_RADIUS_OFFSET = 10;

  // Draw a ball (optimized)
  const drawBall = (ball) => {
    const { x, y, width, color, trail } = ball;

    // Draw trail if enabled
    if (settings.enableTrails && trail.length > 0) {
      const trailLen = trail.length;
      for (let i = 0; i < trailLen; i++) {
        const trailPoint = trail[i];
        const ratio = i / trailLen;
        const trailSize = width * ratio;
        const trailOpacity = settings.trailOpacity * ratio;

        context.fillStyle = color.replace(/[\d.]+\)$/, trailOpacity + ")");
        context.beginPath();
        context.arc(trailPoint.x, trailPoint.y, trailSize, 0, TWO_PI);
        context.fill();
      }
    }

    // Draw glow effect if enabled
    if (settings.enableGlow) {
      const glowRadius = width + GLOW_RADIUS_OFFSET;
      const glowGradient = context.createRadialGradient(x, y, 0, x, y, glowRadius);
      glowGradient.addColorStop(0, color.replace(/[\d.]+\)$/, settings.glowIntensity + ")"));
      glowGradient.addColorStop(1, "transparent");

      context.fillStyle = glowGradient;
      context.beginPath();
      context.arc(x, y, glowRadius, 0, TWO_PI);
      context.fill();
    }

    // Draw main ball
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, width, 0, TWO_PI);
    context.fill();
  };

  // Update a ball
  const updateBall = (ball) => {
    // Update trail
    if (settings.enableTrails) {
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > settings.trailLength) {
        ball.trail.shift();
      }
    }

    // Update position with speed multiplier
    ball.x += ball.vx * settings.speed;
    ball.y += ball.vy * settings.speed;

    // Expand ball size with speed multiplier
    ball.width += settings.expansionRate * settings.speed;

    // Check boundaries and reset if needed
    if (ball.x > screen.width || ball.x < 0 || ball.y > screen.height || ball.y < 0) {
      resetBall(ball);
    }
  };

  // Constants for mouse interaction
  const MAX_MOUSE_DISTANCE = 200;
  const MAX_MOUSE_DISTANCE_SQ = MAX_MOUSE_DISTANCE * MAX_MOUSE_DISTANCE;

  // Apply mouse force to a ball (optimized with distance squared check)
  const applyMouseForce = (ball) => {
    if (!settings.enableMouseInteraction) return;

    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < MAX_MOUSE_DISTANCE_SQ && distanceSq > 0) {
      const distance = Math.sqrt(distanceSq);
      const force = (1 - distance / MAX_MOUSE_DISTANCE) * settings.mouseForce * settings.speed;
      const invDistance = 1 / distance;
      ball.vx += dx * invDistance * force;
      ball.vy += dy * invDistance * force;
    }
  };

  // Initialize the expanding balls animation
  const initializeExpandingBalls = () => {
    canvas = canvasElement;
    context = canvas.getContext("2d");

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();

    // Calculate dimensions based on settings
    let width = rect.width || 800;
    let height = rect.height || 400;

    if (settings.width !== "auto") {
      if (typeof settings.width === "number") {
        width = settings.width;
      } else {
        width = parseInt(settings.width) || 800;
      }
    }

    if (settings.height !== "auto") {
      if (typeof settings.height === "number") {
        height = settings.height;
      } else {
        height = parseInt(settings.height) || 400;
      }
    }

    screen = {
      width: width,
      height: height,
    };

    // Set canvas dimensions
    canvas.width = screen.width;
    canvas.height = screen.height;

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

    // Initialize balls
    balls = [];
    for (let i = 0; i < settings.numBalls; i++) {
      balls.push(createBall());
    }

    // Add mouse event listeners if enabled
    if (settings.enableMouseInteraction) {
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove);

      // Store event handlers for cleanup
      eventHandlers = {
        mouseMove: handleMouseMove,
        touchMove: handleTouchMove,
      };
    }
  };

  // Main render function (optimized)
  const render = () => {
    animationId = requestAnimationFrame(render);

    // Clear canvas
    context.fillStyle = settings.backgroundColor;
    context.fillRect(0, 0, screen.width, screen.height);

    // Draw background image if provided and loaded
    if (backgroundImage && backgroundImage.complete) {
      const imgAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = screen.width / screen.height;

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        const drawHeight = screen.height;
        const drawWidth = backgroundImage.width * (screen.height / backgroundImage.height);
        const drawX = (screen.width - drawWidth) / 2;
        context.drawImage(backgroundImage, drawX, 0, drawWidth, drawHeight);
      } else {
        // Image is taller than canvas
        const drawWidth = screen.width;
        const drawHeight = backgroundImage.height * (screen.width / backgroundImage.width);
        const drawY = (screen.height - drawHeight) / 2;
        context.drawImage(backgroundImage, 0, drawY, drawWidth, drawHeight);
      }
    }

    // Update and draw all balls (optimized loop)
    const ballsLen = balls.length;
    const hasMouseInteraction = settings.enableMouseInteraction;

    for (let i = 0; i < ballsLen; i++) {
      const ball = balls[i];
      updateBall(ball);
      if (hasMouseInteraction) {
        applyMouseForce(ball);
      }
      drawBall(ball);
    }
  };

  // Handle window resize
  const onResize = () => {
    initializeExpandingBalls();
  };

  // Start the animation
  const start = () => {
    initializeExpandingBalls();
    render();
    window.addEventListener("resize", onResize);
  };

  // Clean up the animation
  const clean = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener("resize", onResize);

    // Remove event listeners if they exist
    if (eventHandlers) {
      document.removeEventListener("mousemove", eventHandlers.mouseMove);
      document.removeEventListener("touchmove", eventHandlers.touchMove);
    }

    if (context && screen) {
      context.clearRect(0, 0, screen.width, screen.height);
    }
    balls = [];
  };

  return { start, clean };
}
