import React, { useEffect, useRef, useMemo, useCallback } from "react";
import FloatingBallsPlugin from "./FloatingBallsPlugin.js";

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
  colors?: string | { r: number; g: number; b: number };
  radius?: number | string;
  count?: number | string;
  max?: number | string;
  alphaFade?: number | string;
  linkLineWidth?: number | string;
  connectionDistance?: number | string;
  connectionColor?: string;
  addMouseInteraction?: boolean;
}

/**
 * Floating Balls Component
 * A React component that creates animated floating balls with connection lines
 */
export function FloatingBalls({ width = "auto", height = "auto", backgroundColor = "transparent", backgroundImage, speed = 2, advanced, children }: Props) {
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

    // Helper to convert color
    const toColor = (
      value: string | { r: number; g: number; b: number } | undefined,
      defaultValue: { r: number; g: number; b: number }
    ): string | { r: number; g: number; b: number } => {
      if (value === undefined) return defaultValue;
      if (typeof value === "string") return value;
      if (typeof value === "object" && value.r !== undefined && value.g !== undefined && value.b !== undefined) {
        return {
          r: Math.max(0, Math.min(255, value.r)),
          g: Math.max(0, Math.min(255, value.g)),
          b: Math.max(0, Math.min(255, value.b)),
        };
      }
      return defaultValue;
    };

    return {
      backgroundColor,
      backgroundImage: backgroundImage || null,
      speed: toNumber(speed, 2),
      colors: toColor(advanced?.colors, { r: 255, g: 234, b: 0 }),
      radius: toNumber(advanced?.radius, 4),
      count: toNumber(advanced?.count, 30),
      max: toNumber(advanced?.max, 20),
      alphaFade: toNumber(advanced?.alphaFade, 0.03),
      linkLineWidth: toNumber(advanced?.linkLineWidth, 0.2),
      connectionDistance: toNumber(advanced?.connectionDistance, 150),
      connectionColor: advanced?.connectionColor ?? "yellow",
      addMouseInteraction: advanced?.addMouseInteraction ?? true,
    };
  }, [backgroundColor, backgroundImage, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const settings = buildCurrentSettings();
    const floatingBalls = FloatingBallsPlugin(containerRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = floatingBalls;

    floatingBalls.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          const newPlugin = FloatingBallsPlugin(containerRef.current, updatedSettings) as {
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated floating balls background">
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
export type { Props as FloatingBallsProps, AdvancedSettings as FloatingBallsAdvancedSettings };
