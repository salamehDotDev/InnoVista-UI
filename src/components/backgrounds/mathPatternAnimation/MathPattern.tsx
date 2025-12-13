import React, { useEffect, useRef, useMemo, useCallback } from "react";
import MathPatternPlugin from "./MathPatternPlugin.js";

// Simplified interface with all optional settings
interface Props {
  // Basic settings (most commonly used)
  backgroundColor?: string;
  speed?: number | string;
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;

  // Advanced settings (optional)
  advanced?: AdvancedSettings;
}

interface AdvancedSettings {
  gridSize?: number | string;
  pixelSize?: number | string;
  centerX?: number | string;
  centerY?: number | string;
  baseColor?: number | string;
  colorVariation?: number | string;
}

/**
 * Math Pattern Animation Component
 * A React component that creates animated mathematical pattern background using canvas
 */
export function MathPattern({ width = "auto", height = "auto", backgroundColor = "transparent", speed = 0.03, advanced, children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pluginRef = useRef<{ start: () => void; clean: () => void } | null>(null);

  /**
   * Memoized container style calculation
   */
  const containerStyle = useMemo((): React.CSSProperties => {
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
  }, [width, height]);

  /**
   * Memoized canvas style calculation
   */
  const canvasStyle = useMemo((): React.CSSProperties => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "block",
    };
  }, []);

  /**
   * Builds current settings object for the plugin
   */
  const buildCurrentSettings = useCallback(() => {
    // Helper to convert string/number to number
    const toNumber = (value: number | string | undefined, defaultValue: number): number => {
      if (value === undefined) return defaultValue;
      const num = typeof value === "string" ? parseFloat(value) : value;
      return isNaN(num) ? defaultValue : num;
    };

    return {
      backgroundColor,
      speed: toNumber(speed, 0.03),
      gridSize: toNumber(advanced?.gridSize, 30),
      pixelSize: toNumber(advanced?.pixelSize, 10),
      centerX: toNumber(advanced?.centerX, 100),
      centerY: toNumber(advanced?.centerY, 100),
      baseColor: toNumber(advanced?.baseColor, 192),
      colorVariation: toNumber(advanced?.colorVariation, 64),
    };
  }, [backgroundColor, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const settings = buildCurrentSettings();
    const mathPattern = MathPatternPlugin(canvasRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = mathPattern;

    mathPattern.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current && canvasRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          const newPlugin = MathPatternPlugin(canvasRef.current, updatedSettings) as {
            start: () => void;
            clean: () => void;
          };
          pluginRef.current = newPlugin;
          pluginRef.current.start();
          break;
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (pluginRef.current) {
        pluginRef.current.clean();
        pluginRef.current = null;
      }
    };
  }, [buildCurrentSettings]);

  return (
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated mathematical pattern background">
      <canvas ref={canvasRef} style={canvasStyle} />
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
          role="region"
          aria-label="Content overlay"
        >
          <div
            style={{
              pointerEvents: "auto",
              position: "relative",
              zIndex: 31,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Export types for users who need them
export type { Props as MathPatternProps, AdvancedSettings as MathPatternAdvancedSettings };
