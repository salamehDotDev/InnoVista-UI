import React, { useEffect, useRef } from "react";
import AnimatedCirclesPlugin from "./AnimatedCirclesPlugin.js";

// Simplified interface with all optional settings
interface Props {
  // Basic settings (most commonly used)
  backgroundColor?: string;
  backgroundImage?: string;
  speed?: number | string;
  intensity?: "subtle" | "normal" | "intense"; // Easy preset control

  // Advanced settings (optional)
  advanced?: AdvancedSettings;

  // Layout
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;
}

interface AdvancedSettings {
  count?: number | string;
  size?: number | string;
  spread?: number | string;
  opacity?: number;
  blendMode?: "screen" | "multiply" | "overlay" | "lighten" | "darken" | "color-dodge" | "color-burn";
  layers?: number;
  animation?: {
    rotation?: boolean;
    scale?: boolean;
    translation?: boolean;
  };
}

// Intensity presets for easy configuration
const INTENSITY_PRESETS = {
  subtle: { count: 20, size: 5, spread: 2, opacity: 0.6, layers: 2 },
  normal: { count: 40, size: 7, spread: 3, opacity: 0.9, layers: 4 },
  intense: { count: 80, size: 10, spread: 4, opacity: 1, layers: 6 },
};

export function AnimatedCircles({
  width = "auto",
  height = "auto",
  backgroundColor = "#123",
  backgroundImage,
  speed = 1,
  intensity = "normal",
  advanced,
  children,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<{ start: () => void; clean: () => void; resize?: () => void } | null>(null);

  // Calculate container dimensions based on settings
  const getContainerStyle = () => {
    const style: React.CSSProperties = {
      position: "relative",
      overflow: "hidden",
      width: "100%",
    };

    // Set height based on animation settings
    if (height === "auto") {
      style.height = "100vh";
      style.minHeight = "400px";
    } else if (typeof height === "number") {
      style.height = `${height}px`;
    } else if (typeof height === "string") {
      // Handle string values like "100%", "100vh", "500px", etc.
      if (height === "100%") {
        // For 100%, ensure parent has height by using minHeight as fallback
        style.height = "100%";
        style.minHeight = "400px";
      } else {
        style.height = height;
      }
    } else {
      style.height = "100vh";
      style.minHeight = "400px";
    }

    // Set width based on animation settings
    if (width === "auto") {
      style.width = "100%";
    } else if (typeof width === "number") {
      style.width = `${width}px`;
    } else if (typeof width === "string") {
      // Handle string values like "100%", "100vw", "500px", etc.
      style.width = width;
    } else {
      style.width = "100%";
    }

    return style;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Build settings inside useEffect to avoid dependency issues
    const buildCurrentSettings = () => {
      const preset = INTENSITY_PRESETS[intensity];

      return {
        backgroundColor,
        backgroundImage: backgroundImage || null,
        speed,
        count: advanced?.count ?? preset.count,
        size: advanced?.size ?? preset.size,
        spread: advanced?.spread ?? preset.spread,
        opacity: advanced?.opacity ?? preset.opacity,
        enableMultipleLayers: (advanced?.layers ?? preset.layers) > 1,
        layerCount: advanced?.layers ?? preset.layers,
        enableRotation: advanced?.animation?.rotation ?? true,
        enableScale: advanced?.animation?.scale ?? true,
        enableTranslation: advanced?.animation?.translation ?? true,
        scaleRange: [12, 18] as [number, number],
        translationRange: [-20, 20] as [number, number],
        rotationRange: [0, 360] as [number, number],
        blendMode: advanced?.blendMode ?? "screen",
      };
    };

    const settings = buildCurrentSettings();
    const animatedCircles = AnimatedCirclesPlugin(canvasRef.current, settings);
    pluginRef.current = animatedCircles;

    animatedCircles.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Reinitialize when container size changes
      if (pluginRef.current) {
        pluginRef.current.clean();
        const updatedSettings = buildCurrentSettings();
        pluginRef.current = AnimatedCirclesPlugin(canvasRef.current, updatedSettings);
        pluginRef.current.start();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (pluginRef.current) {
        pluginRef.current.clean();
        pluginRef.current = null;
      }
    };
  }, [backgroundColor, backgroundImage, speed, intensity, advanced]);

  return (
    <div ref={containerRef} style={getContainerStyle()}>
      <canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 0,
          pointerEvents: "none",
        }}
        ref={canvasRef}
        id={"dotsCanvas"}
      />
      {children && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 30,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ pointerEvents: "auto", position: "relative", zIndex: 31 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

// Export types for users who need them
export type { Props as AnimatedCirclesProps, AdvancedSettings as AnimatedCirclesAdvancedSettings };
