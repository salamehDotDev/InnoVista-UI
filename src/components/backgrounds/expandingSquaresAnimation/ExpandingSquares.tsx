import React, { useEffect, useRef, useMemo, useCallback } from "react";
import ExpandingSquaresPlugin from "./ExpandingSquaresPlugin.js";

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
  duration?: number | string;
  enableBorder?: boolean;
  borderWidth?: number | string;
}

/**
 * Expanding Squares Component
 * A React component that creates animated expanding squares background
 */
export function ExpandingSquares({ width = "auto", height = "auto", backgroundColor = "#08be88", backgroundImage, speed = 1, advanced, children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<{ start: () => void; clean: () => void } | null>(null);

  /**
   * Converts speed to duration (speed is inverse - higher speed = lower duration)
   * @param speedValue - Speed value to convert
   * @returns Duration in seconds
   */
  const speedToDuration = useCallback((speedValue: number | string): number => {
    const numSpeed = typeof speedValue === "string" ? parseFloat(speedValue) : speedValue;
    if (isNaN(numSpeed) || numSpeed <= 0) {
      return 12; // Default duration
    }
    // Speed of 1 = duration of 12, speed of 2 = duration of 6, etc.
    return 12 / numSpeed;
  }, []);

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
    const duration = advanced?.duration ?? speedToDuration(speed);

    return {
      backgroundColor,
      backgroundImage: backgroundImage || null,
      count: advanced?.count ?? 5,
      color: advanced?.color ?? "#079e71",
      size: advanced?.size ?? 10,
      duration: typeof duration === "string" ? parseFloat(duration) : duration,
      enableBorder: advanced?.enableBorder ?? true,
      borderWidth: advanced?.borderWidth ?? 1,
    };
  }, [backgroundColor, backgroundImage, speed, advanced, speedToDuration]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const settings = buildCurrentSettings();
    const expandingSquares = ExpandingSquaresPlugin(containerRef.current, settings);
    pluginRef.current = expandingSquares;

    expandingSquares.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          pluginRef.current = ExpandingSquaresPlugin(containerRef.current, updatedSettings);
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated expanding squares background">
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
export type { Props as ExpandingSquaresProps, AdvancedSettings as ExpandingSquaresAdvancedSettings };
