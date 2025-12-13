import React, { useEffect, useRef, useMemo, useCallback } from "react";
import FirefliesPlugin from "./FirefliesPlugin.js";

// Simplified interface with all optional settings
interface Props {
  // Basic settings (most commonly used)
  backgroundColor?: string;
  backgroundImage?: string;
  speed?: number | string;
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;

  // Advanced settings (optional)
  advanced?: AdvancedSettings;
}

interface AdvancedSettings {
  count?: number | string;
  color?: string;
  size?: number | string;
  opacity?: number | string;
  fireflySpeed?: number | string;
  glow?: boolean;
  glowIntensity?: number | string;
  glowSize?: number | string;
  flickerSpeed?: number | string;
  flickerIntensity?: number | string;
  enableTrails?: boolean;
  trailLength?: number | string;
  trailOpacity?: number | string;
  enableWander?: boolean;
  wanderSpeed?: number | string;
  wanderRadius?: number | string;
}

/**
 * Fireflies Component
 * A React component that creates animated fireflies background
 */
export function Fireflies({ width = "auto", height = "auto", backgroundColor = "#0a0a0a", backgroundImage, speed = 1, advanced, children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      backgroundImage: backgroundImage || null,
      speed: toNumber(speed, 1),
      count: toNumber(advanced?.count, 30),
      color: advanced?.color ?? "#ffff00",
      size: toNumber(advanced?.size, 2),
      opacity: toNumber(advanced?.opacity, 0.8),
      fireflySpeed: toNumber(advanced?.fireflySpeed, 0.5),
      glow: advanced?.glow ?? true,
      glowIntensity: toNumber(advanced?.glowIntensity, 0.6),
      glowSize: toNumber(advanced?.glowSize, 15),
      flickerSpeed: toNumber(advanced?.flickerSpeed, 0.02),
      flickerIntensity: toNumber(advanced?.flickerIntensity, 0.3),
      enableTrails: advanced?.enableTrails ?? true,
      trailLength: toNumber(advanced?.trailLength, 5),
      trailOpacity: toNumber(advanced?.trailOpacity, 0.1),
      enableWander: advanced?.enableWander ?? true,
      wanderSpeed: toNumber(advanced?.wanderSpeed, 0.3),
      wanderRadius: toNumber(advanced?.wanderRadius, 50),
    };
  }, [backgroundColor, backgroundImage, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const settings = buildCurrentSettings();
    const fireflies = FirefliesPlugin(containerRef.current, settings) as {
      start: () => void;
      clean: () => void;
    }

    pluginRef.current = fireflies;

    fireflies.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          const newPlugin = FirefliesPlugin(containerRef.current, updatedSettings) as {
            start: () => void;
            clean: () => void;
          };
          pluginRef.current = newPlugin;
          pluginRef.current.start();
          break;
        }
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
  }, [buildCurrentSettings]);

  return (
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated fireflies background">
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
export type { Props as FirefliesProps, AdvancedSettings as FirefliesAdvancedSettings };
