import React, { useEffect, useRef, useMemo, useCallback } from "react";
import GeometricAnimationPlugin from "./GeometricAnimationPlugin.js";

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
  types?: string[];
  colors?: string[];
  enableMouseInteraction?: boolean;
  mouseSensitivity?: number | string;
  enableParticles?: boolean;
  particleCount?: number | string;
  enableGradientOverlay?: boolean;
}

/**
 * Geometric Animation Component
 * A React component that creates animated geometric shapes background
 */
export function GeometricAnimation({ width = "auto", height = "auto", backgroundColor = "#1a1a2e", backgroundImage, speed = 1, advanced, children }: Props) {
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
      count: toNumber(advanced?.count, 40),
      types: advanced?.types && Array.isArray(advanced.types) && advanced.types.length > 0 ? advanced.types : ["square", "circle", "triangle", "rectangle"],
      colors: advanced?.colors && Array.isArray(advanced.colors) && advanced.colors.length > 0 ? advanced.colors : ["#f72585", "#4cc9f0", "#7209b7", "#4361ee"],
      enableMouseInteraction: advanced?.enableMouseInteraction ?? true,
      mouseSensitivity: toNumber(advanced?.mouseSensitivity, 0.05),
      enableParticles: advanced?.enableParticles ?? true,
      particleCount: toNumber(advanced?.particleCount, 100),
      enableGradientOverlay: advanced?.enableGradientOverlay ?? true,
    };
  }, [backgroundColor, backgroundImage, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const settings = buildCurrentSettings();
    const geometricAnimation = GeometricAnimationPlugin(containerRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = geometricAnimation;

    geometricAnimation.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          const newPlugin = GeometricAnimationPlugin(containerRef.current, updatedSettings) as {
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated geometric shapes background">
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
export type { Props as GeometricAnimationProps, AdvancedSettings as GeometricAnimationAdvancedSettings };
