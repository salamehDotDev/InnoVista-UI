const defaultSettings = Object.freeze({
  backgroundColor: "#123",
  backgroundImage: null,
  speed: 1,
  count: 40,
  size: 7,
  spread: 3,
  opacity: 0.9,
  duration: 44,
  delay: -27,
  enableMultipleLayers: true,
  layerCount: 4,
  enableRotation: true,
  enableScale: true,
  enableTranslation: true,
  scaleRange: [12, 18],
  translationRange: [-20, 20],
  rotationRange: [0, 360],
  blendMode: "screen",
});

export default function AnimatedCirclesPlugin(containerElement, animationSettings = {}) {
  let container;
  let newContainer;
  let settings = { ...defaultSettings, ...animationSettings };
  let dots = [];

  // Helper function to normalize size value
  const normalizeSize = (size) => {
    if (typeof size === "number") {
      return `${size}px`;
    }
    // If it's a string
    if (typeof size === "string") {
      // Check if it already has a unit (px, em, rem, etc.)
      if (/^-?\d+\.?\d*(px|em|rem|vh|vw|%|pt|pc|in|cm|mm|ex|ch)$/i.test(size)) {
        return size;
      }
      // If it's a numeric string without unit, add px
      const numValue = parseFloat(size);
      if (!isNaN(numValue)) {
        return `${numValue}px`;
      }
    }
    // Fallback to the original value
    return size;
  };

  const handleSpreadValue = (spread) => {
    const spreadValue = Number(spread);

    if (spreadValue === 0) {
      return 1;
    }

    return spreadValue;
  };

  // Create a single dot layer
  const createDotLayer = (layerIndex) => {
    const animationDuration = (settings.duration - layerIndex) / Number(settings.speed);
    const animationDelay = settings.delay - layerIndex * 4;

    const generateTextShadow = () => {
      const shadows = [];
      const sizeValue = normalizeSize(settings.size);
      const spreadValue = handleSpreadValue(settings.spread);
      const countValue = Number(settings.count);
      for (let i = 0; i < countValue; i++) {
        const x = (-0.5 + Math.random()) * spreadValue;
        const y = (-0.5 + Math.random()) * spreadValue;
        const hue = Math.random() * 360;
        const shadow = `${x}em ${y}em ${sizeValue} hsla(${hue}, 100%, 50%, ${settings.opacity})`;
        shadows.push(shadow);
      }
      return shadows.join(", ");
    };

    const element = document.createElement("div");
    element.className = `dots-anim-layer dots-anim-layer-${layerIndex}`;
    element.textContent = ".";
    element.style.textShadow = generateTextShadow();
    element.style.animationDuration = `${animationDuration}s`;
    element.style.animationDelay = `${animationDelay}s`;
    // Note: mixBlendMode is set in CSS to avoid conflicts

    return element;
  };

  // Create dots HTML structure
  const createDotsHTML = () => {
    // Create a unique ID for this instance
    const uniqueId = "dots-anim-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    // Instead of replacing the canvas, we'll create a new container alongside it
    const parent = container.parentElement;

    if (!parent) {
      return null;
    }

    newContainer = document.createElement("div");
    newContainer.id = uniqueId;
    newContainer.style.position = "absolute";
    newContainer.style.top = "0";
    newContainer.style.left = "0";
    newContainer.style.width = "100%";
    newContainer.style.height = "100%";
    newContainer.style.overflow = "hidden";
    newContainer.style.zIndex = "10"; // Place above canvas but below children

    // Hide the original canvas for dots animation
    container.style.display = "none";

    // Add the new container to the parent
    parent.appendChild(newContainer);

    // Ensure the parent has proper positioning
    const parentStyle = getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }

    // Create the HTML structure
    const html = `
      <div class='dots-anim-background'></div>
      <div class='dots-anim-container'></div>
    `;

    // Inject HTML
    newContainer.innerHTML = html;

    // Create dot layers
    const dotsContainer = newContainer.querySelector(".dots-anim-container");
    const layersToCreate = settings.enableMultipleLayers ? settings.layerCount : 1;

    dots = [];
    for (let layer = 0; layer < layersToCreate; layer++) {
      const dotElement = createDotLayer(layer);
      dotsContainer.appendChild(dotElement);
      dots.push(dotElement);
    }

    // Create and inject CSS with unique animations
    const style = document.createElement("style");
    style.id = "dots-anim-styles-" + uniqueId;
    style.textContent = `
      #${uniqueId} {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      #${uniqueId} .dots-anim-background {
        background-color: ${settings.backgroundColor};
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }

      #${uniqueId} .dots-anim-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
        font: 5vmin/1.3 serif;
        pointer-events: none;
      }

      #${uniqueId} .dots-anim-layer {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3em;
        height: 3em;
        color: transparent;
        mix-blend-mode: ${settings.blendMode};
        animation: dots-anim-move-${uniqueId} ${settings.duration / Number(settings.speed)}s ${settings.delay}s infinite ease-in-out alternate;
        transform: translate(-50%, -50%);
      }

      #${uniqueId} .dots-anim-layer-0 {
        animation-duration: ${settings.duration / Number(settings.speed)}s;
        animation-delay: ${settings.delay}s;
      }

      #${uniqueId} .dots-anim-layer-1 {
        animation-duration: ${(settings.duration - 1) / Number(settings.speed)}s;
        animation-delay: ${settings.delay - 4}s;
      }

      #${uniqueId} .dots-anim-layer-2 {
        animation-duration: ${(settings.duration - 2) / Number(settings.speed)}s;
        animation-delay: ${settings.delay - 8}s;
      }

      #${uniqueId} .dots-anim-layer-3 {
        animation-duration: ${(settings.duration - 3) / Number(settings.speed)}s;
        animation-delay: ${settings.delay - 12}s;
      }

      @keyframes dots-anim-move-${uniqueId} {
        from {
          transform: translate(-50%, -50%) ${settings.enableRotation ? `rotate(${settings.rotationRange[0]}deg)` : ""} ${
      settings.enableScale ? `scale(${settings.scaleRange[0]})` : ""
    } ${settings.enableTranslation ? `translateX(${settings.translationRange[0]}px)` : ""};
        }
        to {
          transform: translate(-50%, -50%) ${settings.enableRotation ? `rotate(${settings.rotationRange[1]}deg)` : ""} ${
      settings.enableScale ? `scale(${settings.scaleRange[1]})` : ""
    } ${settings.enableTranslation ? `translateX(${settings.translationRange[1]}px)` : ""};
        }
      }
    `;

    // Remove existing styles if any (only for this specific instance)
    const existingStyle = document.getElementById("dots-anim-styles-" + uniqueId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    document.head.appendChild(style);

    // Add background image if provided
    if (settings.backgroundImage) {
      const background = newContainer.querySelector(".dots-anim-background");
      background.style.backgroundImage = `url(${settings.backgroundImage})`;
      background.style.backgroundSize = "cover";
      background.style.backgroundPosition = "center";
    }

    // Store the unique ID for cleanup
    newContainer._uniqueId = uniqueId;

    // Store reference for cleanup
    newContainer._originalCanvas = container;

    return uniqueId;
  };

  // Initialize the dots animation
  const initializeDots = (containerElement, animationSettings = {}) => {
    // Check if container exists
    if (!containerElement) {
      return;
    }

    // Update settings with provided animationSettings
    settings = { ...defaultSettings, ...animationSettings };

    container = containerElement;

    // Ensure container is in the DOM
    if (!container.parentElement) {
      return;
    }

    try {
      // Create the dots animation HTML structure
      createDotsHTML();
    } catch {
      // Silently handle initialization errors
    }
  };

  // Debounced resize handler
  let resizeTimeout = null;
  const onResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (container) {
        // Clean up existing animation
        if (newContainer) {
          newContainer.remove();
        }
        // Reinitialize with current settings
        initializeDots(container, settings);
      }
    }, 150);
  };

  // Start the animation
  const start = () => {
    initializeDots(containerElement, animationSettings);
    window.addEventListener("resize", onResize);
  };

  // Clean up the animation
  const clean = () => {
    window.removeEventListener("resize", onResize);

    if (newContainer) {
      try {
        // Show the original canvas
        if (newContainer._originalCanvas) {
          newContainer._originalCanvas.style.display = "block";
        }

        // Remove the dots container
        newContainer.remove();

        // Remove the specific style for this instance
        const style = document.getElementById("dots-anim-styles-" + newContainer._uniqueId);
        if (style) {
          style.remove();
        }
      } catch {
        // Silently handle cleanup errors
      }
    }

    container = null;
    newContainer = null;
    dots = [];
  };

  return { start, clean };
}
