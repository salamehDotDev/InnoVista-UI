import React, { useEffect, useRef } from "react";
// @ts-expect-error - JS file export, TypeScript may not recognize it
import ExpandingCirclesPlugin from "./expandingCircles.js";

// Simplified interface with all optional settings
interface Props {
  // Basic settings (most commonly used)
  backgroundColor?: string;
  backgroundImage?: string | null;
  speed?: number | string;
  circleColor?: string;
  maxCircles?: number;

  // Advanced settings (optional)
  advanced?: AdvancedSettings;

  // Layout
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;
}

interface AdvancedSettings {
  spawnInterval?: number;
  expansionDuration?: number;
  maxRadius?: number;
  minRadius?: number;
  initialOpacity?: number;
  enableRandomColors?: boolean;
  colorPalette?: string[];
}

// Default advanced style settings
const DEFAULT_ADVANCED_STYLE: AdvancedSettings = {
  spawnInterval: 80,
  expansionDuration: 1500,
  maxRadius: 15,
  minRadius: 0,
  initialOpacity: 0.8,
  enableRandomColors: false,
};

export function ExpandingCircles({
  width = "auto",
  height = "auto",
  backgroundColor = "#0f0f23",
  backgroundImage = null,
  speed = 1,
  circleColor = "#27ae60",
  maxCircles = 80,
  advanced,
  children,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<{ start: () => void; clean: () => void } | null>(null);

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
      return {
        backgroundColor,
        backgroundImage: backgroundImage || null,
        speed: typeof speed === "string" ? parseFloat(speed) || 1 : speed,
        circleColor,
        maxCircles,
        ...DEFAULT_ADVANCED_STYLE,
        ...(advanced || {}),
      };
    };

    const settings = buildCurrentSettings();
    const expandingCircles = ExpandingCirclesPlugin(canvasRef.current, settings);
    pluginRef.current = expandingCircles;

    expandingCircles.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Reinitialize when container size changes
      if (pluginRef.current && canvasRef.current) {
        pluginRef.current.clean();
        const updatedSettings = buildCurrentSettings();
        const newPlugin = ExpandingCirclesPlugin(canvasRef.current, updatedSettings);
        pluginRef.current = newPlugin;
        newPlugin.start();
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
  }, [backgroundColor, backgroundImage, speed, circleColor, maxCircles, advanced]);

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
        id={"expandingCirclesCanvas"}
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
export type { Props as ExpandingCirclesProps, AdvancedSettings as ExpandingCirclesAdvancedSettings };
