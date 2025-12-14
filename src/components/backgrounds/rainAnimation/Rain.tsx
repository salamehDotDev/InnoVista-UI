import React, { useEffect, useRef, useMemo, useCallback } from "react";
import RainPlugin from "./RainPlugin.js";

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
  color?: string;
  rainHeight?: number | string;
  count?: number | string;
  width?: number | string;
}

/**
 * Rain Animation Component
 * A React component that creates animated rain drops using canvas
 */
export function Rain({ width = "auto", height = "auto", backgroundColor = "transparent", speed = 3, advanced, children }: Props) {
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
      speed: toNumber(speed, 30),
      color: advanced?.color || "#3b82f6",
      rainHeight: toNumber(advanced?.rainHeight, 100),
      count: toNumber(advanced?.count, 30),
      width: toNumber(advanced?.width, 1),
    };
  }, [backgroundColor, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const settings = buildCurrentSettings();
    const rain = RainPlugin(canvasRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = rain;

    rain.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current && canvasRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          pluginRef.current = RainPlugin(canvasRef.current, updatedSettings) as {
            start: () => void;
            clean: () => void;
          };
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated rain background">
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
export type { Props as RainProps, AdvancedSettings as RainAdvancedSettings };
