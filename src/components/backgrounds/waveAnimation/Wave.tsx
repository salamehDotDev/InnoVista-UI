import React, { useEffect, useRef, useMemo, useCallback } from "react";
import WavePlugin from "./WavePlugin.js";

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
  colors?: string[];
  opacities?: number[] | string[];
  durations?: number[] | string[];
  size?: number | string;
  waveHeight?: number | string;
  rotation?: number | string;
  radius?: number | string;
  offsetX?: number | string;
  originX?: number | string;
  offsetY?: number | string;
  originY?: number | string;
}

/**
 * Wave Animation Component
 * A React component that creates animated rotating waves using canvas
 */
export function Wave({ width = "auto", height = "auto", backgroundColor = "#0e6cc4", backgroundImage, speed = 1, advanced, children }: Props) {
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

    // Helper to convert array of strings/numbers to array of numbers
    const toNumberArray = (values: (number | string)[] | undefined, defaultValue: number[]): number[] => {
      if (!values || !Array.isArray(values)) return defaultValue;
      return values.map((val) => toNumber(val, defaultValue[0] || 0));
    };

    // Convert speed to duration multiplier (speed of 1 = normal, speed of 2 = 2x faster = half duration)
    const speedMultiplier = toNumber(speed, 1);
    const baseDurations = advanced?.durations ? toNumberArray(advanced.durations, [7000, 7500, 3000]) : [7000, 7500, 3000];
    const durations = baseDurations.map((duration) => duration / speedMultiplier);

    return {
      backgroundColor,
      backgroundImage: backgroundImage || null,
      count: toNumber(advanced?.count, 3),
      colors: advanced?.colors || ["#0af", "#77daff", "#000"],
      opacities: advanced?.opacities ? toNumberArray(advanced.opacities, [0.4, 0.4, 0.1]) : [0.4, 0.4, 0.1],
      durations,
      size: toNumber(advanced?.size, 1500),
      waveHeight: toNumber(advanced?.waveHeight, 1300),
      rotation: toNumber(advanced?.rotation, 80),
      radius: toNumber(advanced?.radius, 43),
      offsetX: toNumber(advanced?.offsetX, -700),
      originX: toNumber(advanced?.originX, 50),
      offsetY: toNumber(advanced?.offsetY, 400),
      originY: toNumber(advanced?.originY, 48),
    };
  }, [backgroundColor, backgroundImage, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const settings = buildCurrentSettings();
    const wave = WavePlugin(canvasRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = wave;

    wave.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current && canvasRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          pluginRef.current = WavePlugin(canvasRef.current, updatedSettings) as {
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated wave background">
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
export type { Props as WaveProps, AdvancedSettings as WaveAdvancedSettings };
