import React, { useEffect, useRef } from "react";
import CrystalBallPlugin from "./crystalBallPlugin.js";

interface Props {
  styleSettings?: StyleSettings;
  width?: string | number | "auto";
  height?: string | number | "auto";
  children?: React.ReactNode;
}

interface StyleSettings {
  backgroundColor?: string | null;
  backgroundImage?: null | string;
  circle1Color: string;
  circle2Color: string;
  circle3Color: string;
  circle4Color: string;
  speed: number | string;
  enableText: boolean;
  textContent?: string;
  textColor?: string;
  textSize?: string | number;
}

export function CrystalBall({ width = "auto", height = "auto", styleSettings, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<{ start: () => void; clean: () => void; resize?: () => void } | null>(null);

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

    // Check if children exist - if they do, disable text rendering
    const hasChildren = children != null && children !== false && (Array.isArray(children) ? children.length > 0 : true);

    // If children exist, disable text rendering and ignore text-related settings
    const modifiedSettings = hasChildren
      ? {
          ...styleSettings,
          enableText: false,
          textContent: "",
        }
      : styleSettings;

    const crystalBall = CrystalBallPlugin(canvasRef.current, modifiedSettings);
    pluginRef.current = crystalBall;

    crystalBall.start();

    // Setup ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Reinitialize when container size changes to recalculate circle sizes
      if (pluginRef.current) {
        pluginRef.current.clean();
        const currentHasChildren = children != null && children !== false && (Array.isArray(children) ? children.length > 0 : true);
        const updatedSettings = currentHasChildren ? { ...styleSettings, enableText: false, textContent: "" } : styleSettings;
        pluginRef.current = CrystalBallPlugin(canvasRef.current, updatedSettings);
        pluginRef.current.start();
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
  }, [styleSettings, children]);

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
        id={"canvas123"}
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

// Also export the types for users who need them
export type { Props as CrystalBallProps, StyleSettings };
