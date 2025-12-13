import React, { useEffect, useRef, useMemo, useCallback } from "react";
import FloatingParticlesPlugin from "./FloatingParticlesPlugin.js";

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
  size?: number | string;
  opacity?: number | string;
  duration?: number | string;
  delay?: number | string;
  enableFade?: boolean;
  enableScale?: boolean;
  enableBlendMode?: boolean;
  blendMode?: string;
  scaleRange?: [number, number] | [string, string];
  fadeDuration?: number | string;
  scaleDuration?: number | string;
  enableBackgroundImage?: boolean;
  enableMask?: boolean;
  maskGradient?: string;
}

/**
 * Floating Particles Component
 * A React component that creates animated floating particles background
 */
export function FloatingParticles({ width = "auto", height = "auto", backgroundColor = "#021027", backgroundImage, speed = 1, advanced, children }: Props) {
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

    // Helper to convert scale range
    const toScaleRange = (value: [number, number] | [string, string] | undefined, defaultValue: [number, number]): [number, number] => {
      if (value === undefined) return defaultValue;
      return [typeof value[0] === "string" ? parseFloat(value[0]) : value[0], typeof value[1] === "string" ? parseFloat(value[1]) : value[1]];
    };

    return {
      backgroundColor,
      backgroundImage: backgroundImage || null,
      speed: toNumber(speed, 1),
      count: toNumber(advanced?.count, 100),
      size: toNumber(advanced?.size, 8),
      opacity: toNumber(advanced?.opacity, 0.8),
      duration: toNumber(advanced?.duration, 15000),
      delay: toNumber(advanced?.delay, 2000),
      enableFade: advanced?.enableFade ?? true,
      enableScale: advanced?.enableScale ?? true,
      enableBlendMode: advanced?.enableBlendMode ?? true,
      blendMode: advanced?.blendMode ?? "screen",
      scaleRange: toScaleRange(advanced?.scaleRange, [0.4, 2.2]),
      fadeDuration: toNumber(advanced?.fadeDuration, 200),
      scaleDuration: toNumber(advanced?.scaleDuration, 2000),
      enableBackgroundImage: advanced?.enableBackgroundImage ?? true,
      enableMask: advanced?.enableMask ?? true,
      maskGradient: advanced?.maskGradient ?? "radial-gradient(white 0%, white 30%, transparent 80%, transparent)",
    };
  }, [backgroundColor, backgroundImage, speed, advanced]);

  /**
   * Effect to initialize and manage the animation
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const settings = buildCurrentSettings();
    const floatingParticles = FloatingParticlesPlugin(containerRef.current, settings) as {
      start: () => void;
      clean: () => void;
    };
    pluginRef.current = floatingParticles;

    floatingParticles.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      // Only reinitialize if size actually changed
      for (const entry of entries) {
        if (entry.target === containerRef.current && pluginRef.current) {
          pluginRef.current.clean();
          const updatedSettings = buildCurrentSettings();
          const newPlugin = FloatingParticlesPlugin(containerRef.current, updatedSettings) as {
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
    <div ref={containerRef} style={containerStyle} role="presentation" aria-label="Animated floating particles background">
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
export type { Props as FloatingParticlesProps, AdvancedSettings as FloatingParticlesAdvancedSettings };
