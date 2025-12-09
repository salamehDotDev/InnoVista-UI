import React, { useEffect, useRef } from "react";
// @ts-expect-error - JS file export, TypeScript may not recognize it
import ExpandingBallsPlugin from "./expandingBalls.js";

// Simplified interface with grouped settings
interface Props {
  // Basic settings
  backgroundColor?: string;
  backgroundImage?: string;
  speed?: number | string;
  intensity?: "subtle" | "normal" | "intense";

  // Convenience props (can be set directly without advanced object)
  count?: number; // Number of balls (overrides intensity preset)
  colors?: string[]; // Color palette (overrides default)

  // Advanced settings (optional)
  advanced?: AdvancedSettings;

  // Layout
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;
}

interface AdvancedSettings {
  count?: number;
  size?: { min?: number; max?: number };
  expansionRate?: number;
  velocityRange?: number;
  colors?: string[];
  effects?: {
    glow?: boolean;
    trails?: boolean;
    mouseInteraction?: boolean;
  };
}

// Default color palette
const DEFAULT_COLORS = [
  "85, 221, 224,", // Cyan
  "51, 101, 138,", // Blue
  "47, 72, 88,", // Dark Blue
  "246, 174, 45,", // Orange
  "242, 100, 25,", // Red Orange
] as const;

// Intensity presets for easy configuration
const INTENSITY_PRESETS = {
  subtle: {
    count: 30,
    size: { min: 3, max: 10 },
    expansionRate: 0.05,
    velocityRange: 2,
    effects: { glow: false, trails: false, mouseInteraction: false },
  },
  normal: {
    count: 70,
    size: { min: 4, max: 16 },
    expansionRate: 0.1,
    velocityRange: 4,
    effects: { glow: false, trails: false, mouseInteraction: false },
  },
  intense: {
    count: 120,
    size: { min: 5, max: 20 },
    expansionRate: 0.15,
    velocityRange: 6,
    effects: { glow: true, trails: true, mouseInteraction: false },
  },
} as const;

export function ExpandingBalls({
  width = "auto",
  height = "auto",
  backgroundColor = "#000000",
  backgroundImage,
  speed = 1,
  intensity = "normal",
  count,
  colors,
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
      const preset = INTENSITY_PRESETS[intensity];
      const effects = advanced?.effects ?? preset.effects;

      return {
        backgroundColor,
        backgroundImage: backgroundImage || null,
        speed: typeof speed === "string" ? parseFloat(speed) || 1 : speed,
        // Use convenience props first, then advanced, then preset
        numBalls: count ?? advanced?.count ?? preset.count,
        colors: colors ?? advanced?.colors ?? DEFAULT_COLORS,
        minBallSize: advanced?.size?.min ?? preset.size.min,
        maxBallSize: advanced?.size?.max ?? preset.size.max,
        expansionRate: advanced?.expansionRate ?? preset.expansionRate,
        velocityRange: advanced?.velocityRange ?? preset.velocityRange,
        enableMouseInteraction: effects?.mouseInteraction ?? false,
        mouseForce: 0.5,
        enableGlow: effects?.glow ?? false,
        glowIntensity: 0.3,
        enableTrails: effects?.trails ?? false,
        trailLength: 5,
        trailOpacity: 0.2,
      };
    };

    const settings = buildCurrentSettings();
    const expandingBalls = ExpandingBallsPlugin(canvasRef.current, settings);
    pluginRef.current = expandingBalls;

    expandingBalls.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Reinitialize when container size changes
      if (pluginRef.current && canvasRef.current) {
        pluginRef.current.clean();
        const updatedSettings = buildCurrentSettings();
        const newPlugin = ExpandingBallsPlugin(canvasRef.current, updatedSettings);
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
  }, [backgroundColor, backgroundImage, speed, intensity, count, colors, advanced]);

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
        id={"expandingBallsCanvas"}
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
export type { Props as ExpandingBallsProps, AdvancedSettings as ExpandingBallsAdvancedSettings };
