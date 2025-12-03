const defaultSettings = Object.freeze({
  backgroundColor: "white",
  backgroundImage: null,
  circle1Color: "#f8f4ff",
  circle2Color: "#e6d9ff",
  circle3Color: "#d4b3ff",
  circle4Color: "#ff00ff",
  speed: 1,
  enableText: true,
  textContent: "Adam",
  textColor: "#ffffff",
  textSize: 37,
});

export default function CrystalBallPlugin(containerElement, animationSettings = {}) {
  let container;
  let newContainer;
  let settings = { ...defaultSettings, ...animationSettings };

  // Calculate responsive sizes based on container dimensions
  const calculateSizes = () => {
    const parent = container.parentElement;
    if (!parent) return null;

    const rect = parent.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Use the smallest dimension to ensure circles fit completely
    const minDimension = Math.min(containerWidth, containerHeight);

    // Scale factor: use 90% of the smallest dimension to leave some padding
    const scaleFactor = minDimension * 0.9;

    // Base sizes (from original design)
    const baseSizes = {
      circle: 1300,
      circle1: 1000,
      circle2: 700,
      circle3: 500,
    };

    // Calculate responsive sizes maintaining proportions
    const sizes = {
      circle: (baseSizes.circle / baseSizes.circle) * scaleFactor,
      circle1: (baseSizes.circle1 / baseSizes.circle) * scaleFactor,
      circle2: (baseSizes.circle2 / baseSizes.circle) * scaleFactor,
      circle3: (baseSizes.circle3 / baseSizes.circle) * scaleFactor,
    };

    // Calculate text size based on smallest circle
    const textSize = Math.max(16, (sizes.circle3 / 500) * (typeof settings.textSize === "number" ? settings.textSize : 37));

    console.log(textSize);

    return { sizes, textSize, containerWidth, containerHeight };
  };

  // Create crystal ball HTML structure
  const createCrystalBallHTML = () => {
    // Calculate responsive sizes
    const sizeData = calculateSizes();
    if (!sizeData) {
      console.error("CrystalBall: Could not calculate container sizes");
      return null;
    }

    const { sizes, textSize } = sizeData;

    // Create a unique ID for this instance
    const uniqueId = "crystal-ball-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    // Instead of replacing the canvas, we'll create a new container alongside it
    const parent = container.parentElement;

    if (!parent) {
      console.error("CrystalBall: Canvas element must have a parent element");
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

    // Hide the original canvas for crystal ball animation
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
      <div class='crystal-ball-background'>
        <div class='crystal-ball-circle'>
          <div class='crystal-ball-circle1'>
            <div class='crystal-ball-circle2'>
              <div class='crystal-ball-circle3'>
                ${settings.enableText ? `<div class='crystal-ball-name'>${settings.textContent}</div>` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject HTML
    newContainer.innerHTML = html;

    // Calculate animation sizes (5% larger for pulse effect)
    const pulse1Base = sizes.circle2;
    const pulse1Max = pulse1Base * 1.071; // ~750/700 ratio

    const pulse2Base = sizes.circle3;
    const pulse2Max = pulse2Base * 1.1; // 550/500 ratio

    const pulse3Base = sizes.circle1;
    const pulse3Max = pulse3Base * 1.05; // 1050/1000 ratio

    // Create and inject CSS with responsive sizes
    const style = document.createElement("style");
    style.id = "crystal-ball-styles-" + uniqueId;
    style.textContent = `
      #${uniqueId} {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      #${uniqueId} .crystal-ball-background {
        background-color: ${settings.backgroundColor};
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      #${uniqueId} .crystal-ball-circle {
        background-color: ${settings.circle1Color};
        height: ${sizes.circle}px;
        border-radius: 50%;
        width: ${sizes.circle}px;
        margin: auto;
        position: absolute;
        top: 50%; 
        left: 50%;
        transform: translate(-50%,-50%);
      }

      #${uniqueId} .crystal-ball-circle1 {
        background-color: ${settings.circle2Color};
        height: ${sizes.circle1}px;
        border-radius: 50%;
        width: ${sizes.circle1}px;
        margin: auto;
        position: absolute;
        top: 50%; 
        left: 50%;
        transform: translate(-50%,-50%);
        animation: crystal-ball-pulse3-${uniqueId} ${10 / settings.speed}s ease-in-out infinite;
      }

      #${uniqueId} .crystal-ball-circle2 {
        background-color: ${settings.circle3Color};
        height: ${sizes.circle2}px;
        border-radius: 50%;
        width: ${sizes.circle2}px;
        margin: auto;
        position: absolute;
        top: 50%; 
        left: 50%;
        color: white;
        transform: translate(-50%,-50%);
        animation: crystal-ball-pulse-${uniqueId} ${4 / settings.speed}s ease-in-out infinite;
      }

      #${uniqueId} .crystal-ball-circle3 {
        background-color: ${settings.circle4Color};
        height: ${sizes.circle3}px;
        border-radius: 50%;
        width: ${sizes.circle3}px;
        margin: auto;
        position: absolute;
        top: 50%; 
        left: 50%;
        transform: translate(-50%,-50%);
        animation: crystal-ball-pulse2-${uniqueId} ${3 / settings.speed}s ease-in-out infinite;
      }

      #${uniqueId} .crystal-ball-name {
        text-align: center;
        font-size: ${textSize}px;
        position: relative;
        font-family: 'Exo', sans-serif;
        color: ${settings.textColor};
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }

      #${uniqueId} .crystal-ball-star {
        transform: translate(350px,50px);
        opacity: .6;
      }

      @keyframes crystal-ball-pulse-${uniqueId} {
        0% { 
          width: ${pulse1Base}px; 
          height: ${pulse1Base}px; 
          transform: translate(-50%,-50%);
        }
        50% { 
          width: ${pulse1Max}px; 
          height: ${pulse1Max}px; 
          transform: translate(-50%,-50%);
        }
        100% { 
          width: ${pulse1Base}px; 
          height: ${pulse1Base}px; 
          transform: translate(-50%,-50%);
        }
      }

      @keyframes crystal-ball-pulse2-${uniqueId} {
        0% { 
          width: ${pulse2Base}px; 
          height: ${pulse2Base}px; 
          transform: translate(-50%,-50%);
        }
        50% { 
          width: ${pulse2Max}px; 
          height: ${pulse2Max}px; 
          transform: translate(-50%,-50%);
        }
        100% { 
          width: ${pulse2Base}px; 
          height: ${pulse2Base}px; 
          transform: translate(-50%,-50%);
        }
      }

      @keyframes crystal-ball-pulse3-${uniqueId} {
        0% { 
          width: ${pulse3Base}px; 
          height: ${pulse3Base}px; 
          transform: translate(-50%,-50%);
        }
        50% { 
          width: ${pulse3Max}px; 
          height: ${pulse3Max}px; 
          transform: translate(-50%,-50%);
        }
        100% { 
          width: ${pulse3Base}px; 
          height: ${pulse3Base}px; 
          transform: translate(-50%,-50%);
        }
      }
    `;

    // Remove existing styles if any (only for this specific instance)
    const existingStyle = document.getElementById("crystal-ball-styles-" + uniqueId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    document.head.appendChild(style);

    // Add background image if provided
    if (settings.backgroundImage) {
      const background = newContainer.querySelector(".crystal-ball-background");
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

  // Initialize the crystal ball animation
  const initializeCrystalBall = (containerElement, animationSettings = {}) => {
    // Check if container exists
    if (!containerElement) {
      console.error("CrystalBall: Container element is required");
      return;
    }

    // Update settings with provided animationSettings
    settings = { ...defaultSettings, ...animationSettings };

    container = containerElement;

    // Ensure container is in the DOM
    if (!container.parentElement) {
      console.error("CrystalBall: Canvas element must be mounted in the DOM");
      return;
    }

    try {
      // For this animation, we'll create a div alongside the canvas and inject HTML/CSS
      createCrystalBallHTML();
    } catch (error) {
      console.error("CrystalBall: Error initializing animation", error);
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
        // Reinitialize with current settings to recalculate sizes
        initializeCrystalBall(container, settings);
      }
    }, 150);
  };

  // Start the animation
  const start = () => {
    initializeCrystalBall(containerElement, animationSettings);
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

        // Remove the crystal ball container
        newContainer.remove();

        // Remove the specific style for this instance
        const style = document.getElementById("crystal-ball-styles-" + newContainer._uniqueId);
        if (style) {
          style.remove();
        }
      } catch {
        // Silently handle cleanup errors
      }
    }

    container = null;
    newContainer = null;
  };

  return { start, clean };
}
