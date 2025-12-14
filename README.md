<div align="center">

# @innovista/ui

![Innovista UI Banner](https://img.shields.io/badge/Innovista-UI-6366f1?style=for-the-badge&logo=react&logoColor=white)

### A modern React UI component library built with TypeScript

[![npm version](https://img.shields.io/npm/v/@innovista/ui?style=flat-square&color=blue&logo=npm)](https://www.npmjs.com/package/@innovista/ui)
[![npm downloads](https://img.shields.io/npm/dm/@innovista/ui?style=flat-square&color=green)](https://www.npmjs.com/package/@innovista/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@innovista/ui?style=flat-square&color=orange)](https://bundlephobia.com/package/@innovista/ui)
[![license](https://img.shields.io/npm/l/@innovista/ui?style=flat-square&color=red)](LICENSE)
[![typescript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![react](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)

Build beautiful, fast, and maintainable websites with our collection of carefully crafted React components.

[📖 Documentation](#-components) • [⚡ Quick Start](#-quick-start) • [💡 Examples](#-components) • [🐛 Issues](https://github.com/salamehDotDev/InnoVista-UI)

</div>

<br />

---

## ✨ Features

<table>
  <tr>
    <td align="center">🎨<br /><b>Beautiful</b><br />Carefully designed components</td>
    <td align="center">⚡<br /><b>Fast</b><br />Optimized performance</td>
    <td align="center">📦<br /><b>Lightweight</b><br />Tree-shakeable imports</td>
  </tr>
  <tr>
    <td align="center">🔷<br /><b>TypeScript</b><br />Full type support</td>
    <td align="center">🎯<br /><b>Flexible</b><br />Works everywhere</td>
    <td align="center">🛠️<br /><b>Customizable</b><br />Highly configurable</td>
  </tr>
</table>

<br />

## 📦 Installation

Install the package using your favorite package manager:

```bash
# npm
npm install @innovista/ui

# yarn
yarn add @innovista/ui

# pnpm
pnpm add @innovista/ui
```

💡 Note for PowerShell users

Use quotes when installing scoped packages:

```powershell
npm install "@innovista/ui"
```

<!-- <br />

## 🚀 Quick Start

Get up and running in less than a minute:

```tsx
import { CrystalBall } from "@innovista/ui";

function App() {
  return (
    <CrystalBall
      width="100%"
      height="100vh"
      styleSettings={{
        backgroundColor: "#000",
        circle1Color: "#f8f4ff",
        circle2Color: "#e6d9ff",
        circle3Color: "#d4b3ff",
        circle4Color: "#ff00ff",
        speed: 1,
        enableText: true,
        textContent: "Welcome",
        textColor: "#ffffff",
        textSize: 37,
      }}
    >
      <div style={{ padding: "2rem" }}>
        <h1>Your Content Here</h1>
      </div>
    </CrystalBall>
  );
}
```

🎉 **That's it!** You're ready to build amazing UIs. -->

<br />

## 🧩 Components

### 🔮 CrystalBall

> An animated crystal ball background component with customizable styles and smooth pulsating animations. Perfect for creating eye-catching hero sections and landing pages.

💡 **Pro Tip:** When you provide `children`, text rendering is automatically disabled to avoid conflicts.

<br />

#### 📋 Props

| Prop            | Type                                 | Default    | Description                         |
| --------------- | ------------------------------------ | ---------- | ----------------------------------- |
| `width`         | `string \| number \| "auto" \| null` | `"auto"`   | Width of the component              |
| `height`        | `string \| number \| "auto" \| null` | `"auto"`   | Height of the component             |
| `styleSettings` | `StyleSettings`                      | `Optional` | Animation and styling configuration |
| `children`      | `React.ReactNode`                    | -          | Content to display over animation   |

<br />

<details>
<summary>📝 <b>StyleSettings Interface</b></summary>

<br />

```typescript
interface StyleSettings {
  // Background Configuration
  backgroundColor?: string | null; // Background color
  backgroundImage?: string | null; // Optional background image URL

  // Circle Colors (from outer to inner)
  circle1Color: string; // Outermost circle color
  circle2Color: string; // Second circle color
  circle3Color: string; // Third circle color
  circle4Color: string; // Innermost circle color

  // Animation Settings
  speed: number | string; // Animation speed (higher = faster)

  // Text Configuration
  enableText: boolean; // Show/hide center text
  textContent?: string; // Text to display
  textColor?: string; // Text color
  textSize?: string | number; // Text size
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { CrystalBall } from "@innovista/ui";

function HeroSection() {
  return (
    <CrystalBall>
      <div className="hero-content">
        <h1>Welcome to Innovista</h1>
        <p>Building amazing experiences</p>
      </div>
    </CrystalBall>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Styling</b></summary>

<br />

```tsx
import { CrystalBall } from "@innovista/ui";

function AdvancedExample() {
  const styleSettings = {
    backgroundColor: "#1a1a2e",
    backgroundImage: null,
    circle1Color: "#16213e",
    circle2Color: "#0f3460",
    circle3Color: "#533483",
    circle4Color: "#e94560",
    speed: 1.5, // Faster animation
    enableText: true,
    textContent: "Innovista UI",
    textColor: "#ffffff",
    textSize: 48,
  };

  return (
    <CrystalBall width="100%" height="600px" styleSettings={styleSettings}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Beautiful Animations</h1>
        <p style={{ fontSize: "1.2rem" }}>Create stunning visual effects with ease</p>
      </div>
    </CrystalBall>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { CrystalBall } from "@innovista/ui";

export default function HomePage() {
  return (
    <CrystalBall
      width="100%"
      height="100vh"
      styleSettings={{
        backgroundColor: "#0f0f23",
        circle1Color: "#1a1a3e",
        circle2Color: "#2d2d5e",
        circle3Color: "#4a4a8e",
        circle4Color: "#6b6bbe",
        speed: 1,
        enableText: true,
        textContent: "Next.js + Innovista",
        textColor: "#ffffff",
        textSize: 40,
      }}
    >
      <main style={{ padding: "2rem" }}>
        <h1>Welcome to Next.js</h1>
      </main>
    </CrystalBall>
  );
}
```

</details>

<details>
<summary><b>With Custom Background Image</b></summary>

<br />

```tsx
import { CrystalBall } from "@innovista/ui";

function CustomStyled() {
  return (
    <CrystalBall
      width="100%"
      height="500px"
      styleSettings={{
        backgroundColor: "transparent",
        backgroundImage: "/your-image.jpg'",
        circle1Color: "rgba(255, 255, 255, 0.1)",
        circle2Color: "rgba(255, 255, 255, 0.2)",
        circle3Color: "rgba(255, 255, 255, 0.3)",
        circle4Color: "rgba(255, 255, 255, 0.4)",
        speed: 0.8, // Slower animation
        enableText: false,
        textContent: "",
        textColor: "#ffffff",
        textSize: 37,
      }}
    >
      <div className="custom-content">{/* Your custom content */}</div>
    </CrystalBall>
  );
}
```

</details>

<br />

---

### ✨ AnimatedCircles

> A mesmerizing animated background component featuring dynamic floating circles with customizable colors, speeds, and effects. Create stunning visual experiences with layered animations and blend modes.

💡 **Pro Tip:** Use `intensity` presets (`subtle`, `normal`, `intense`) for quick setup, or fine-tune every detail with the `advanced` prop.

<br />

#### 📋 Props

| Prop              | Type                                | Default     | Description                                  |
| ----------------- | ----------------------------------- | ----------- | -------------------------------------------- |
| `width`           | `string \| number \| "auto"`        | `"auto"`    | Width of the component                       |
| `height`          | `string \| number \| "auto"`        | `"auto"`    | Height of the component                      |
| `backgroundColor` | `string`                            | `"#123"`    | Background color                             |
| `backgroundImage` | `string`                            | `undefined` | Optional background image URL                |
| `speed`           | `number \| string`                  | `1`         | Animation speed (higher = faster)            |
| `intensity`       | `"subtle" \| "normal" \| "intense"` | `"normal"`  | Preset intensity level                       |
| `advanced`        | `AnimatedCirclesAdvancedSettings`   | `undefined` | Advanced customization (overrides intensity) |
| `children`        | `React.ReactNode`                   | -           | Content to display over animation            |

<br />

<details>
<summary>📝 <b>Intensity Presets</b></summary>

<br />

```typescript
// Built-in intensity presets
const INTENSITY_PRESETS = {
  subtle: {
    count: 20, // Fewer circles
    size: 5, // Smaller size
    spread: 2, // Tighter spread
    opacity: 0.6, // More transparent
    layers: 2, // Fewer layers
  },
  normal: {
    count: 40,
    size: 7,
    spread: 3,
    opacity: 0.9,
    layers: 4,
  },
  intense: {
    count: 80, // More circles
    size: 10, // Larger size
    spread: 4, // Wider spread
    opacity: 1, // Fully opaque
    layers: 6, // More layers
  },
};
```

</details>

<details>
<summary>📝 <b>AnimatedCirclesAdvancedSettings Interface</b></summary>

<br />

```typescript
interface AnimatedCirclesAdvancedSettings {
  // Circle Configuration
  count?: number | string; // Number of circles (overrides intensity preset)
  size?: number | string; // Size of circles (overrides intensity preset)
  spread?: number | string; // Spread radius (overrides intensity preset)
  opacity?: number; // Circle opacity 0-1 (overrides intensity preset)
  layers?: number; // Number of animation layers (overrides intensity preset)

  // Animation Controls
  animation?: {
    rotation?: boolean; // Enable rotation animation (default: true)
    scale?: boolean; // Enable scale animation (default: true)
    translation?: boolean; // Enable translation animation (default: true)
  };

  // Visual Effects
  blendMode?: "screen" | "multiply" | "overlay" | "lighten" | "darken" | "color-dodge" | "color-burn";
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage - Using Intensity Presets</b></summary>

<br />

```tsx
import { AnimatedCircles } from "@innovista/ui";

function HeroSection() {
  return (
    <AnimatedCircles backgroundColor="#0a0a0a" intensity="normal" speed={1}>
      <div className="hero-content">
        <h1>Beautiful Animated Backgrounds</h1>
        <p>Create stunning visual effects effortlessly</p>
      </div>
    </AnimatedCircles>
  );
}
```

</details>

<details>
<summary><b>Simple Setup - Three Different Intensities</b></summary>

<br />

```tsx
import { AnimatedCircles } from "@innovista/ui";

// Subtle - Perfect for light backgrounds
function SubtleExample() {
  return (
    <AnimatedCircles intensity="subtle" backgroundColor="#f0f0f0">
      <h2>Subtle and Elegant</h2>
    </AnimatedCircles>
  );
}

// Normal - Balanced default
function NormalExample() {
  return (
    <AnimatedCircles intensity="normal" backgroundColor="#1a1a1a">
      <h2>Perfect Balance</h2>
    </AnimatedCircles>
  );
}

// Intense - Maximum impact
function IntenseExample() {
  return (
    <AnimatedCircles intensity="intense" backgroundColor="#000">
      <h2>Bold and Dynamic</h2>
    </AnimatedCircles>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { AnimatedCircles } from "@innovista/ui";

function AdvancedExample() {
  return (
    <AnimatedCircles
      width="100%"
      height="100vh"
      backgroundColor="#000000"
      speed={1.5}
      intensity="intense"
      advanced={{
        count: 60,
        size: 10,
        spread: 4,
        opacity: 0.95,
        layers: 6,
        blendMode: "screen",
        animation: {
          rotation: true,
          scale: true,
          translation: true,
        },
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "white",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Innovista UI</h1>
        <p style={{ fontSize: "1.5rem" }}>Next-level animations</p>
      </div>
    </AnimatedCircles>
  );
}
```

</details>

<details>
<summary><b>Subtle Background Effect</b></summary>

<br />

```tsx
import { AnimatedCircles } from "@innovista/ui";

function SubtleBackground() {
  return (
    <AnimatedCircles
      width="100%"
      height="600px"
      backgroundColor="#f5f5f5"
      speed={0.5}
      intensity="subtle"
      advanced={{
        opacity: 0.4,
        blendMode: "multiply",
      }}
    >
      <div style={{ padding: "3rem" }}>
        <h2>Elegant Content Section</h2>
        <p>Subtle animations enhance without overwhelming</p>
      </div>
    </AnimatedCircles>
  );
}
```

</details>

<details>
<summary><b>Intense Visual Experience</b></summary>

<br />

```tsx
import { AnimatedCircles } from "@innovista/ui";

function IntenseVisual() {
  return (
    <AnimatedCircles
      width="100%"
      height="100vh"
      backgroundColor="#120458"
      speed={2}
      intensity="intense"
      advanced={{
        size: 12,
        spread: 5,
        layers: 8,
        blendMode: "color-dodge",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "white",
          fontSize: "4rem",
          fontWeight: "bold",
        }}
      >
        WOW!
      </div>
    </AnimatedCircles>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { AnimatedCircles } from "@innovista/ui";

export default function HomePage() {
  return (
    <AnimatedCircles
      width="100%"
      height="100vh"
      backgroundColor="#0f0f23"
      speed={1.2}
      intensity="normal"
      advanced={{
        count: 50,
        size: 8,
        spread: 3.5,
        opacity: 0.85,
        layers: 5,
        blendMode: "screen",
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful animations out of the box</p>
      </main>
    </AnimatedCircles>
  );
}
```

</details>

<br />

---

### 🎯 ExpandingBalls

> A dynamic animated background component featuring expanding and moving balls that create mesmerizing visual effects. Perfect for modern, energetic designs with customizable colors, speeds, and interactive effects.

💡 **Pro Tip:** Use `intensity` presets (`subtle`, `normal`, `intense`) for quick setup, or customize with convenience props (`count`, `colors`) or fine-tune with the `advanced` prop.

<br />

#### 📋 Props

| Prop              | Type                                | Default     | Description                                  |
| ----------------- | ----------------------------------- | ----------- | -------------------------------------------- |
| `width`           | `string \| number \| "auto"`        | `"auto"`    | Width of the component                       |
| `height`          | `string \| number \| "auto"`        | `"auto"`    | Height of the component                      |
| `backgroundColor` | `string`                            | `"#000000"` | Background color                             |
| `backgroundImage` | `string`                            | `undefined` | Optional background image URL                |
| `speed`           | `number \| string`                  | `1`         | Animation speed (higher = faster)            |
| `intensity`       | `"subtle" \| "normal" \| "intense"` | `"normal"`  | Preset intensity level                       |
| `count`           | `number`                            | `undefined` | Number of balls (overrides intensity preset) |
| `colors`          | `string[]`                          | `undefined` | Color palette (overrides default)            |
| `advanced`        | `ExpandingBallsAdvancedSettings`    | `undefined` | Advanced customization (overrides intensity) |
| `children`        | `React.ReactNode`                   | -           | Content to display over animation            |

<br />

<details>
<summary>📝 <b>Intensity Presets</b></summary>

<br />

```typescript
// Built-in intensity presets
const INTENSITY_PRESETS = {
  subtle: {
    count: 30, // Fewer balls
    size: { min: 3, max: 10 }, // Smaller size range
    expansionRate: 0.05, // Slower expansion
    velocityRange: 2, // Slower movement
    effects: { glow: false, trails: false, mouseInteraction: false },
  },
  normal: {
    count: 70, // Balanced number
    size: { min: 4, max: 16 }, // Medium size range
    expansionRate: 0.1, // Moderate expansion
    velocityRange: 4, // Moderate movement
    effects: { glow: false, trails: false, mouseInteraction: false },
  },
  intense: {
    count: 120, // More balls
    size: { min: 5, max: 20 }, // Larger size range
    expansionRate: 0.15, // Faster expansion
    velocityRange: 6, // Faster movement
    effects: { glow: true, trails: true, mouseInteraction: false },
  },
};
```

</details>

<details>
<summary>📝 <b>ExpandingBallsAdvancedSettings Interface</b></summary>

<br />

```typescript
interface ExpandingBallsAdvancedSettings {
  // Ball Configuration
  count?: number; // Number of balls (overrides intensity preset)
  size?: {
    min?: number; // Minimum ball size in pixels
    max?: number; // Maximum ball size in pixels
  };
  expansionRate?: number; // How fast balls expand (lower = slower)
  velocityRange?: number; // Movement speed range (lower = slower)
  colors?: string[]; // Color palette array (RGB format: "r, g, b," or hex: "#ffffff")

  // Visual Effects
  effects?: {
    glow?: boolean; // Enable glow effect around balls
    trails?: boolean; // Enable motion trails
    mouseInteraction?: boolean; // Enable mouse/touch interaction
  };
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage - Using Intensity Presets</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

function HeroSection() {
  return (
    <ExpandingBalls backgroundColor="#000000" intensity="normal" speed={1}>
      <div className="hero-content">
        <h1>Dynamic Animated Backgrounds</h1>
        <p>Create stunning visual effects effortlessly</p>
      </div>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>Simple Setup - Three Different Intensities</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

// Subtle - Perfect for minimal designs
function SubtleExample() {
  return (
    <ExpandingBalls intensity="subtle" backgroundColor="#0a0a0a">
      <h2>Subtle and Smooth</h2>
    </ExpandingBalls>
  );
}

// Normal - Balanced default
function NormalExample() {
  return (
    <ExpandingBalls intensity="normal" backgroundColor="#000000">
      <h2>Perfect Balance</h2>
    </ExpandingBalls>
  );
}

// Intense - Maximum visual impact
function IntenseExample() {
  return (
    <ExpandingBalls intensity="intense" backgroundColor="#000">
      <h2>Bold and Dynamic</h2>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>Using Convenience Props</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

function CustomExample() {
  return (
    <ExpandingBalls
      backgroundColor="#1a1a2e"
      speed={1.5}
      count={50} // Override preset count
      colors={[
        "255, 107, 107,", // Red
        "255, 159, 64,", // Orange
        "255, 206, 84,", // Yellow
        "75, 192, 192,", // Teal
        "54, 162, 235,", // Blue
      ]}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Custom Colors and Count</h1>
      </div>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

function AdvancedExample() {
  return (
    <ExpandingBalls
      width="100%"
      height="100vh"
      backgroundColor="#000000"
      speed={1.5}
      intensity="intense"
      advanced={{
        count: 100,
        size: { min: 5, max: 25 },
        expansionRate: 0.12,
        velocityRange: 5,
        colors: [
          "138, 43, 226,", // Blue Violet
          "75, 0, 130,", // Indigo
          "148, 0, 211,", // Dark Violet
        ],
        effects: {
          glow: true,
          trails: true,
          mouseInteraction: false,
        },
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "white",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Innovista UI</h1>
        <p style={{ fontSize: "1.5rem" }}>Next-level animations</p>
      </div>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>With Mouse Interaction</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

function InteractiveExample() {
  return (
    <ExpandingBalls
      width="100%"
      height="100vh"
      backgroundColor="#0f0f23"
      speed={1}
      intensity="normal"
      advanced={{
        effects: {
          glow: true,
          trails: true,
          mouseInteraction: true, // Enable mouse interaction
        },
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Move your mouse to interact!</h1>
        <p>The balls will react to your cursor movement</p>
      </div>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>Subtle Background Effect</b></summary>

<br />

```tsx
import { ExpandingBalls } from "@innovista/ui";

function SubtleBackground() {
  return (
    <ExpandingBalls
      width="100%"
      height="600px"
      backgroundColor="#1a1a1a"
      speed={0.8}
      intensity="subtle"
      advanced={{
        expansionRate: 0.03, // Very slow expansion
        velocityRange: 1.5, // Very slow movement
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Elegant Content Section</h2>
        <p>Subtle animations enhance without overwhelming</p>
      </div>
    </ExpandingBalls>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { ExpandingBalls } from "@innovista/ui";

export default function HomePage() {
  return (
    <ExpandingBalls
      width="100%"
      height="100vh"
      backgroundColor="#0f0f23"
      speed={1.2}
      intensity="normal"
      colors={[
        "85, 221, 224,", // Cyan
        "51, 101, 138,", // Blue
        "246, 174, 45,", // Orange
      ]}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful animations out of the box</p>
      </main>
    </ExpandingBalls>
  );
}
```

</details>

<br />

---

### 🎈 FloatingBalls

> An animated background component featuring floating balls with connection lines. Create dynamic network visualizations with customizable colors, sizes, and interactive mouse effects.

💡 **Pro Tip:** Use the `advanced` prop to fine-tune the connection lines, ball colors, and enable mouse interaction for an interactive experience.

<br />

#### 📋 Props

| Prop              | Type                            | Default         | Description                       |
| ----------------- | ------------------------------- | --------------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`    | `"auto"`        | Width of the component            |
| `height`          | `string \| number \| "auto"`    | `"auto"`        | Height of the component           |
| `backgroundColor` | `string`                        | `"transparent"` | Background color                  |
| `backgroundImage` | `string`                        | `undefined`     | Optional background image URL     |
| `speed`           | `number \| string`              | `2`             | Animation speed (higher = faster) |
| `advanced`        | `FloatingBallsAdvancedSettings` | `undefined`     | Advanced customization options    |
| `children`        | `React.ReactNode`               | -               | Content to display over animation |

<br />

<details>
<summary>📝 <b>FloatingBallsAdvancedSettings Interface</b></summary>

<br />

```typescript
interface FloatingBallsAdvancedSettings {
  colors?: string | { r: number; g: number; b: number }; // Ball colors (hex string or RGB object)
  radius?: number | string; // Ball radius in pixels
  count?: number | string; // Number of balls
  max?: number | string; // Maximum number of balls
  alphaFade?: number | string; // Alpha fade value for connections
  linkLineWidth?: number | string; // Connection line width
  connectionDistance?: number | string; // Maximum distance for connections
  connectionColor?: string; // Connection line color
  addMouseInteraction?: boolean; // Enable mouse/touch interaction
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { FloatingBalls } from "@innovista/ui";

function HeroSection() {
  return (
    <FloatingBalls backgroundColor="#0a0a0a" speed={2}>
      <div className="hero-content">
        <h1>Network Visualization</h1>
        <p>Beautiful floating balls with connections</p>
      </div>
    </FloatingBalls>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { FloatingBalls } from "@innovista/ui";

function AdvancedExample() {
  return (
    <FloatingBalls
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={2}
      advanced={{
        colors: "#4e54c8",
        radius: 3,
        count: 50,
        linkLineWidth: 1,
        connectionDistance: 150,
        connectionColor: "rgba(78, 84, 200, 0.3)",
        addMouseInteraction: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Interactive Network</h1>
        <p>Move your mouse to interact with the balls</p>
      </div>
    </FloatingBalls>
  );
}
```

</details>

<details>
<summary><b>With RGB Color Object</b></summary>

<br />

```tsx
import { FloatingBalls } from "@innovista/ui";

function RGBExample() {
  return (
    <FloatingBalls
      backgroundColor="#000000"
      speed={1.5}
      advanced={{
        colors: { r: 255, g: 107, b: 107 }, // Red color
        count: 60,
        radius: 4,
        connectionColor: "rgba(255, 107, 107, 0.4)",
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Custom RGB Colors</h1>
      </div>
    </FloatingBalls>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { FloatingBalls } from "@innovista/ui";

export default function HomePage() {
  return (
    <FloatingBalls
      width="100%"
      height="100vh"
      backgroundColor="#0f0f23"
      speed={2}
      advanced={{
        colors: "#6366f1",
        count: 40,
        radius: 3,
        addMouseInteraction: true,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful network animations</p>
      </main>
    </FloatingBalls>
  );
}
```

</details>

<br />

---

### ✨ FloatingParticles

> A beautiful animated background component featuring floating particles with customizable opacity, scale, and blend modes. Perfect for creating elegant, subtle background effects.

💡 **Pro Tip:** Use the `advanced` prop to enable fade effects, scale animations, and blend modes for more sophisticated visual effects.

<br />

#### 📋 Props

| Prop              | Type                                | Default     | Description                       |
| ----------------- | ----------------------------------- | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`        | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"`        | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                            | `"#021027"` | Background color                  |
| `backgroundImage` | `string`                            | `undefined` | Optional background image URL     |
| `speed`           | `number \| string`                  | `1`         | Animation speed (higher = faster) |
| `advanced`        | `FloatingParticlesAdvancedSettings` | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`                   | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>FloatingParticlesAdvancedSettings Interface</b></summary>

<br />

```typescript
interface FloatingParticlesAdvancedSettings {
  count?: number | string; // Number of particles
  size?: number | string; // Particle size in pixels
  opacity?: number | string; // Particle opacity (0-1)
  duration?: number | string; // Animation duration
  delay?: number | string; // Animation delay
  enableFade?: boolean; // Enable fade animation
  enableScale?: boolean; // Enable scale animation
  enableBlendMode?: boolean; // Enable blend mode
  blendMode?: string; // CSS blend mode (e.g., "screen", "multiply")
  scaleRange?: [number, number] | [string, string]; // Scale range [min, max]
  fadeDuration?: number | string; // Fade animation duration
  scaleDuration?: number | string; // Scale animation duration
  enableBackgroundImage?: boolean; // Enable background image
  enableMask?: boolean; // Enable mask effect
  maskGradient?: string; // Mask gradient CSS
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { FloatingParticles } from "@innovista/ui";

function HeroSection() {
  return (
    <FloatingParticles backgroundColor="#021027" speed={1}>
      <div className="hero-content">
        <h1>Elegant Particle Background</h1>
        <p>Subtle and beautiful animations</p>
      </div>
    </FloatingParticles>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Effects</b></summary>

<br />

```tsx
import { FloatingParticles } from "@innovista/ui";

function AdvancedExample() {
  return (
    <FloatingParticles
      width="100%"
      height="100vh"
      backgroundColor="#021027"
      speed={1}
      advanced={{
        count: 50,
        size: 3,
        opacity: 0.8,
        enableFade: true,
        enableScale: true,
        enableBlendMode: true,
        blendMode: "screen",
        scaleRange: [0.5, 1.5],
        fadeDuration: 3,
        scaleDuration: 4,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Advanced Particle Effects</h1>
        <p>Fade and scale animations enabled</p>
      </div>
    </FloatingParticles>
  );
}
```

</details>

<details>
<summary><b>Subtle Background Effect</b></summary>

<br />

```tsx
import { FloatingParticles } from "@innovista/ui";

function SubtleBackground() {
  return (
    <FloatingParticles
      width="100%"
      height="600px"
      backgroundColor="#0a0a0a"
      speed={0.8}
      advanced={{
        count: 30,
        size: 2,
        opacity: 0.4,
        enableFade: true,
        blendMode: "lighten",
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Subtle Particle Effect</h2>
        <p>Perfect for content sections</p>
      </div>
    </FloatingParticles>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { FloatingParticles } from "@innovista/ui";

export default function HomePage() {
  return (
    <FloatingParticles
      width="100%"
      height="100vh"
      backgroundColor="#021027"
      speed={1}
      advanced={{
        count: 40,
        size: 3,
        opacity: 0.7,
        enableFade: true,
        enableScale: true,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful particle animations</p>
      </main>
    </FloatingParticles>
  );
}
```

</details>

<br />

---

### 🔲 FloatingSquares

> An animated background component featuring floating squares with customizable colors, gradients, and random effects. Create modern, geometric visual experiences with smooth animations.

💡 **Pro Tip:** Enable gradient colors and random effects in the `advanced` prop to create more dynamic and varied visual patterns.

<br />

#### 📋 Props

| Prop              | Type                              | Default     | Description                       |
| ----------------- | --------------------------------- | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`      | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"`      | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                          | `"#4e54c8"` | Background color                  |
| `backgroundImage` | `string`                          | `undefined` | Optional background image URL     |
| `speed`           | `number \| string`                | `1`         | Animation speed (higher = faster) |
| `advanced`        | `FloatingSquaresAdvancedSettings` | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`                 | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>FloatingSquaresAdvancedSettings Interface</b></summary>

<br />

```typescript
interface FloatingSquaresAdvancedSettings {
  count?: number | string; // Number of squares
  color?: string; // Square color
  duration?: number | string; // Animation duration
  enableGradient?: boolean; // Enable gradient colors
  gradientColor1?: string; // First gradient color
  gradientColor2?: string; // Second gradient color
  gradientDirection?: string; // Gradient direction (e.g., "to right", "45deg")
  enableRandomSizes?: boolean; // Enable random square sizes
  enableRandomDelays?: boolean; // Enable random animation delays
  enableRandomPositions?: boolean; // Enable random starting positions
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { FloatingSquares } from "@innovista/ui";

function HeroSection() {
  return (
    <FloatingSquares backgroundColor="#4e54c8" speed={1}>
      <div className="hero-content">
        <h1>Geometric Background</h1>
        <p>Floating squares animation</p>
      </div>
    </FloatingSquares>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Gradient</b></summary>

<br />

```tsx
import { FloatingSquares } from "@innovista/ui";

function AdvancedExample() {
  return (
    <FloatingSquares
      width="100%"
      height="100vh"
      backgroundColor="#4e54c8"
      speed={1}
      advanced={{
        count: 50,
        color: "#ffffff",
        duration: 20,
        enableGradient: true,
        gradientColor1: "#ff6b6b",
        gradientColor2: "#4ecdc4",
        gradientDirection: "45deg",
        enableRandomSizes: true,
        enableRandomDelays: true,
        enableRandomPositions: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Gradient Squares</h1>
        <p>Dynamic and colorful animations</p>
      </div>
    </FloatingSquares>
  );
}
```

</details>

<details>
<summary><b>Minimal Design</b></summary>

<br />

```tsx
import { FloatingSquares } from "@innovista/ui";

function MinimalExample() {
  return (
    <FloatingSquares
      width="100%"
      height="600px"
      backgroundColor="#1a1a2e"
      speed={0.8}
      advanced={{
        count: 30,
        color: "rgba(255, 255, 255, 0.1)",
        enableRandomSizes: false,
        enableRandomDelays: true,
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Minimal Floating Squares</h2>
        <p>Clean and elegant design</p>
      </div>
    </FloatingSquares>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { FloatingSquares } from "@innovista/ui";

export default function HomePage() {
  return (
    <FloatingSquares
      width="100%"
      height="100vh"
      backgroundColor="#4e54c8"
      speed={1}
      advanced={{
        count: 40,
        enableGradient: true,
        gradientColor1: "#667eea",
        gradientColor2: "#764ba2",
        enableRandomSizes: true,
        enableRandomDelays: true,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful square animations</p>
      </main>
    </FloatingSquares>
  );
}
```

</details>

<br />

---

### 🔷 GeometricAnimation

> An animated background component featuring dynamic geometric shapes (squares, circles, triangles, rectangles) with mouse interaction, particles, and gradient overlays. Create modern, interactive visual experiences with customizable shapes and colors.

💡 **Pro Tip:** Enable mouse interaction and particles in the `advanced` prop to create an interactive, engaging background that responds to user movement.

<br />

#### 📋 Props

| Prop              | Type                                 | Default     | Description                       |
| ----------------- | ------------------------------------ | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`         | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"`         | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                             | `"#1a1a2e"` | Background color                  |
| `backgroundImage` | `string`                             | `undefined` | Optional background image URL     |
| `speed`           | `number \| string`                   | `1`         | Animation speed (higher = faster) |
| `advanced`        | `GeometricAnimationAdvancedSettings` | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`                    | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>GeometricAnimationAdvancedSettings Interface</b></summary>

<br />

```typescript
interface GeometricAnimationAdvancedSettings {
  count?: number | string; // Number of geometric shapes
  types?: string[]; // Array of shape types: "square", "circle", "triangle", "rectangle"
  colors?: string[]; // Array of color values (hex format)
  enableMouseInteraction?: boolean; // Enable mouse/touch interaction (default: true)
  mouseSensitivity?: number | string; // Mouse interaction sensitivity (default: 0.05)
  enableParticles?: boolean; // Enable particle effects (default: true)
  particleCount?: number | string; // Number of particles (default: 100)
  enableGradientOverlay?: boolean; // Enable gradient overlay effect (default: true)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { GeometricAnimation } from "@innovista/ui";

function HeroSection() {
  return (
    <GeometricAnimation backgroundColor="#1a1a2e" speed={1}>
      <div className="hero-content">
        <h1>Geometric Background</h1>
        <p>Dynamic shapes and particles</p>
      </div>
    </GeometricAnimation>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { GeometricAnimation } from "@innovista/ui";

function AdvancedExample() {
  return (
    <GeometricAnimation
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={1}
      advanced={{
        count: 50,
        types: ["square", "circle", "triangle"],
        colors: ["#f72585", "#4cc9f0", "#7209b7", "#4361ee"],
        enableMouseInteraction: true,
        mouseSensitivity: 0.08,
        enableParticles: true,
        particleCount: 150,
        enableGradientOverlay: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Interactive Geometric Shapes</h1>
        <p>Move your mouse to interact with the shapes</p>
      </div>
    </GeometricAnimation>
  );
}
```

</details>

<details>
<summary><b>Custom Shape Types</b></summary>

<br />

```tsx
import { GeometricAnimation } from "@innovista/ui";

function CustomShapesExample() {
  return (
    <GeometricAnimation
      backgroundColor="#0a0a0a"
      speed={1.2}
      advanced={{
        count: 40,
        types: ["circle", "triangle"], // Only circles and triangles
        colors: ["#ff6b6b", "#4ecdc4", "#ffe66d"],
        enableMouseInteraction: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Custom Shape Selection</h1>
        <p>Only circles and triangles</p>
      </div>
    </GeometricAnimation>
  );
}
```

</details>

<details>
<summary><b>Minimal Design Without Particles</b></summary>

<br />

```tsx
import { GeometricAnimation } from "@innovista/ui";

function MinimalExample() {
  return (
    <GeometricAnimation
      width="100%"
      height="600px"
      backgroundColor="#1a1a2e"
      speed={0.8}
      advanced={{
        count: 30,
        enableParticles: false, // Disable particles
        enableGradientOverlay: false, // Disable gradient
        enableMouseInteraction: false, // Disable mouse interaction
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Minimal Geometric Design</h2>
        <p>Clean shapes without extra effects</p>
      </div>
    </GeometricAnimation>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { GeometricAnimation } from "@innovista/ui";

export default function HomePage() {
  return (
    <GeometricAnimation
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={1}
      advanced={{
        count: 45,
        types: ["square", "circle", "triangle", "rectangle"],
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
        enableMouseInteraction: true,
        enableParticles: true,
        particleCount: 120,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful geometric animations</p>
      </main>
    </GeometricAnimation>
  );
}
```

</details>

<br />

---

### 🌈 GradientSliders

> An animated background component featuring smooth gradient sliders that create elegant, flowing color transitions. Perfect for modern, minimalist designs with customizable colors, angles, and opacity effects.

💡 **Pro Tip:** Use the `advanced` prop to customize the gradient angle, enable alternate animation direction, and control opacity for subtle or bold visual effects.

<br />

#### 📋 Props

| Prop              | Type                              | Default     | Description                       |
| ----------------- | --------------------------------- | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`      | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"`      | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                          | `"#eee"`    | Background color                  |
| `backgroundImage` | `string`                          | `undefined` | Optional background image URL     |
| `speed`           | `number \| string`                | `1`         | Animation speed (higher = faster) |
| `advanced`        | `GradientSlidersAdvancedSettings` | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`                 | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>GradientSlidersAdvancedSettings Interface</b></summary>

<br />

```typescript
interface GradientSlidersAdvancedSettings {
  count?: number | string; // Number of gradient sliders (default: 3)
  colors?: string[]; // Array of color values (hex format, minimum 2 colors, default: ["#FFEFBA", "#FFFFFF"])
  angle?: number | string; // Gradient angle in degrees (default: -60)
  opacity?: number | string; // Opacity value 0-1 (default: 0.5)
  duration?: number | string; // Animation duration in seconds (default: 3)
  enableAlternate?: boolean; // Enable alternate animation direction (default: true)
  enableOpacity?: boolean; // Enable opacity animation (default: true)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { GradientSliders } from "@innovista/ui";

function HeroSection() {
  return (
    <GradientSliders backgroundColor="#eee" speed={1}>
      <div className="hero-content">
        <h1>Gradient Sliders</h1>
        <p>Elegant flowing gradients</p>
      </div>
    </GradientSliders>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { GradientSliders } from "@innovista/ui";

function AdvancedExample() {
  return (
    <GradientSliders
      width="100%"
      height="100vh"
      backgroundColor="#f0f0f0"
      speed={1}
      advanced={{
        count: 4,
        colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
        angle: 45,
        opacity: 0.6,
        duration: 4,
        enableAlternate: true,
        enableOpacity: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Custom Gradient Sliders</h1>
        <p>Beautiful color transitions</p>
      </div>
    </GradientSliders>
  );
}
```

</details>

<details>
<summary><b>Warm Color Palette</b></summary>

<br />

```tsx
import { GradientSliders } from "@innovista/ui";

function WarmColorsExample() {
  return (
    <GradientSliders
      backgroundColor="#fff5e6"
      speed={0.8}
      advanced={{
        colors: ["#ff6b6b", "#ffa500", "#ffd700", "#ffefba"],
        angle: -45,
        opacity: 0.5,
        count: 3,
      }}
    >
      <div style={{ padding: "2rem", color: "#333" }}>
        <h1>Warm Gradient Theme</h1>
        <p>Cozy and inviting colors</p>
      </div>
    </GradientSliders>
  );
}
```

</details>

<details>
<summary><b>Cool Color Palette</b></summary>

<br />

```tsx
import { GradientSliders } from "@innovista/ui";

function CoolColorsExample() {
  return (
    <GradientSliders
      backgroundColor="#e6f3ff"
      speed={1.2}
      advanced={{
        colors: ["#4facfe", "#00f2fe", "#667eea", "#764ba2"],
        angle: 60,
        opacity: 0.7,
        count: 5,
        enableAlternate: true,
      }}
    >
      <div style={{ padding: "2rem", color: "#333" }}>
        <h1>Cool Gradient Theme</h1>
        <p>Calm and professional</p>
      </div>
    </GradientSliders>
  );
}
```

</details>

<details>
<summary><b>Minimal Design</b></summary>

<br />

```tsx
import { GradientSliders } from "@innovista/ui";

function MinimalExample() {
  return (
    <GradientSliders
      width="100%"
      height="600px"
      backgroundColor="#ffffff"
      speed={0.6}
      advanced={{
        count: 2,
        colors: ["#f0f0f0", "#ffffff"],
        opacity: 0.3,
        enableOpacity: false,
      }}
    >
      <div style={{ padding: "3rem", color: "#333" }}>
        <h2>Minimal Gradient Design</h2>
        <p>Subtle and elegant</p>
      </div>
    </GradientSliders>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { GradientSliders } from "@innovista/ui";

export default function HomePage() {
  return (
    <GradientSliders
      width="100%"
      height="100vh"
      backgroundColor="#f5f5f5"
      speed={1}
      advanced={{
        count: 3,
        colors: ["#6366f1", "#8b5cf6", "#ec4899"],
        angle: -60,
        opacity: 0.5,
        duration: 3,
        enableAlternate: true,
        enableOpacity: true,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "#333" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful gradient animations</p>
      </main>
    </GradientSliders>
  );
}
```

</details>

<br />

---

### 🌌 Interstellar

> An animated background component featuring a mesmerizing interstellar effect with stars, rings, and interactive mouse controls. Create space-themed visual experiences with customizable glow effects, pulse animations, and dynamic text overlays.

💡 **Pro Tip:** Enable mouse interaction, glow effects, and pulse animations in the `advanced` prop to create an immersive, interactive space experience that responds to user movement.

<br />

#### 📋 Props

| Prop              | Type                           | Default     | Description                       |
| ----------------- | ------------------------------ | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`   | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"`   | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                       | `"#000000"` | Background color                  |
| `backgroundImage` | `string`                       | `undefined` | Optional background image URL     |
| `speed`           | `number \| string`             | `1`         | Animation speed (higher = faster) |
| `advanced`        | `InterstellarAdvancedSettings` | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`              | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>InterstellarAdvancedSettings Interface</b></summary>

<br />

```typescript
interface InterstellarAdvancedSettings {
  ringCount?: number | string; // Number of rings (default: 35)
  starCount?: number | string; // Number of stars (default: 150)
  scale?: number | string; // Scale factor (default: 150)
  spring?: number | string; // Spring physics value (default: 0.95)
  friction?: number | string; // Friction value (default: 0.95)
  text1?: string; // First text overlay
  text2?: string; // Second text overlay
  enableMouseInteraction?: boolean; // Enable mouse/touch interaction (default: true)
  enableGlow?: boolean; // Enable glow effect (default: false)
  glowIntensity?: number | string; // Glow intensity 0-1 (default: 0.3)
  enablePulse?: boolean; // Enable pulse animation (default: false)
  pulseSpeed?: number | string; // Pulse animation speed (default: 0.02)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { Interstellar } from "@innovista/ui";

function HeroSection() {
  return (
    <Interstellar backgroundColor="#000000" speed={1}>
      <div className="hero-content">
        <h1>Interstellar Experience</h1>
        <p>Journey through space</p>
      </div>
    </Interstellar>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with All Effects</b></summary>

<br />

```tsx
import { Interstellar } from "@innovista/ui";

function AdvancedExample() {
  return (
    <Interstellar
      width="100%"
      height="100vh"
      backgroundColor="#000000"
      speed={1}
      advanced={{
        ringCount: 40,
        starCount: 200,
        scale: 150,
        spring: 0.95,
        friction: 0.95,
        text1: "Welcome",
        text2: "To Space",
        enableMouseInteraction: true,
        enableGlow: true,
        glowIntensity: 0.5,
        enablePulse: true,
        pulseSpeed: 0.03,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Interactive Space Experience</h1>
        <p>Move your mouse to explore</p>
      </div>
    </Interstellar>
  );
}
```

</details>

<details>
<summary><b>With Glow Effect</b></summary>

<br />

```tsx
import { Interstellar } from "@innovista/ui";

function GlowExample() {
  return (
    <Interstellar
      backgroundColor="#0a0a0a"
      speed={1.2}
      advanced={{
        ringCount: 30,
        starCount: 180,
        enableGlow: true,
        glowIntensity: 0.6,
        enableMouseInteraction: true,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Glowing Space Effect</h1>
        <p>Enhanced visual appeal with glow</p>
      </div>
    </Interstellar>
  );
}
```

</details>

<details>
<summary><b>With Pulse Animation</b></summary>

<br />

```tsx
import { Interstellar } from "@innovista/ui";

function PulseExample() {
  return (
    <Interstellar
      backgroundColor="#000000"
      speed={0.8}
      advanced={{
        ringCount: 35,
        starCount: 150,
        enablePulse: true,
        pulseSpeed: 0.025,
        enableMouseInteraction: false,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Pulsing Space Animation</h1>
        <p>Rhythmic pulse effect</p>
      </div>
    </Interstellar>
  );
}
```

</details>

<details>
<summary><b>Minimal Design</b></summary>

<br />

```tsx
import { Interstellar } from "@innovista/ui";

function MinimalExample() {
  return (
    <Interstellar
      width="100%"
      height="600px"
      backgroundColor="#000000"
      speed={0.6}
      advanced={{
        ringCount: 20,
        starCount: 100,
        enableMouseInteraction: false,
        enableGlow: false,
        enablePulse: false,
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Minimal Space Design</h2>
        <p>Clean and simple interstellar effect</p>
      </div>
    </Interstellar>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { Interstellar } from "@innovista/ui";

export default function HomePage() {
  return (
    <Interstellar
      width="100%"
      height="100vh"
      backgroundColor="#000000"
      speed={1}
      advanced={{
        ringCount: 35,
        starCount: 150,
        scale: 150,
        enableMouseInteraction: true,
        enableGlow: true,
        glowIntensity: 0.4,
        enablePulse: true,
        pulseSpeed: 0.02,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful interstellar animations</p>
      </main>
    </Interstellar>
  );
}
```

</details>

<br />

---

### 🔢 MathPattern

> An animated background component featuring dynamic mathematical patterns generated using canvas. Create mesmerizing geometric visualizations with customizable grid sizes, pixel dimensions, color variations, and pattern centers.

💡 **Pro Tip:** Adjust the `gridSize`, `pixelSize`, and `colorVariation` in the `advanced` prop to create different pattern densities and visual effects, from subtle textures to bold geometric designs.

<br />

#### 📋 Props

| Prop              | Type                          | Default         | Description                       |
| ----------------- | ----------------------------- | --------------- | --------------------------------- |
| `width`           | `string \| number \| "auto"`  | `"auto"`        | Width of the component            |
| `height`          | `string \| number \| "auto"`  | `"auto"`        | Height of the component           |
| `backgroundColor` | `string`                      | `"transparent"` | Background color                  |
| `speed`           | `number \| string`            | `0.03`          | Animation speed (higher = faster) |
| `advanced`        | `MathPatternAdvancedSettings` | `undefined`     | Advanced customization options    |
| `children`        | `React.ReactNode`             | -               | Content to display over animation |

<br />

<details>
<summary>📝 <b>MathPatternAdvancedSettings Interface</b></summary>

<br />

```typescript
interface MathPatternAdvancedSettings {
  gridSize?: number | string; // Grid size in pixels (default: 30)
  pixelSize?: number | string; // Pixel size in pixels (default: 10)
  centerX?: number | string; // Pattern center X coordinate (default: 100)
  centerY?: number | string; // Pattern center Y coordinate (default: 100)
  baseColor?: number | string; // Base color value 0-255 (default: 192)
  colorVariation?: number | string; // Color variation range (default: 64)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { MathPattern } from "@innovista/ui";

function HeroSection() {
  return (
    <MathPattern backgroundColor="transparent" speed={0.03}>
      <div className="hero-content">
        <h1>Mathematical Patterns</h1>
        <p>Dynamic geometric visualizations</p>
      </div>
    </MathPattern>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { MathPattern } from "@innovista/ui";

function AdvancedExample() {
  return (
    <MathPattern
      width="100%"
      height="100vh"
      backgroundColor="#0a0a0a"
      speed={0.05}
      advanced={{
        gridSize: 40,
        pixelSize: 12,
        centerX: 150,
        centerY: 150,
        baseColor: 200,
        colorVariation: 80,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Custom Math Pattern</h1>
        <p>Fine-tuned geometric visualization</p>
      </div>
    </MathPattern>
  );
}
```

</details>

<details>
<summary><b>Dense Pattern</b></summary>

<br />

```tsx
import { MathPattern } from "@innovista/ui";

function DensePatternExample() {
  return (
    <MathPattern
      backgroundColor="#000000"
      speed={0.04}
      advanced={{
        gridSize: 20, // Smaller grid = denser pattern
        pixelSize: 8,
        baseColor: 180,
        colorVariation: 75,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Dense Mathematical Pattern</h1>
        <p>Intricate geometric design</p>
      </div>
    </MathPattern>
  );
}
```

</details>

<details>
<summary><b>Sparse Pattern</b></summary>

<br />

```tsx
import { MathPattern } from "@innovista/ui";

function SparsePatternExample() {
  return (
    <MathPattern
      backgroundColor="#f5f5f5"
      speed={0.02}
      advanced={{
        gridSize: 60, // Larger grid = sparser pattern
        pixelSize: 15,
        baseColor: 220,
        colorVariation: 35,
      }}
    >
      <div style={{ padding: "2rem", color: "#333" }}>
        <h1>Subtle Math Pattern</h1>
        <p>Minimal geometric texture</p>
      </div>
    </MathPattern>
  );
}
```

</details>

<details>
<summary><b>High Contrast Pattern</b></summary>

<br />

```tsx
import { MathPattern } from "@innovista/ui";

function HighContrastExample() {
  return (
    <MathPattern
      backgroundColor="#ffffff"
      speed={0.06}
      advanced={{
        gridSize: 35,
        pixelSize: 11,
        baseColor: 128,
        colorVariation: 127, // Maximum variation for high contrast
      }}
    >
      <div style={{ padding: "2rem", color: "#333" }}>
        <h1>High Contrast Pattern</h1>
        <p>Bold geometric visualization</p>
      </div>
    </MathPattern>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { MathPattern } from "@innovista/ui";

export default function HomePage() {
  return (
    <MathPattern
      width="100%"
      height="100vh"
      backgroundColor="#0a0a0a"
      speed={0.03}
      advanced={{
        gridSize: 30,
        pixelSize: 10,
        centerX: 100,
        centerY: 100,
        baseColor: 192,
        colorVariation: 64,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful mathematical patterns</p>
      </main>
    </MathPattern>
  );
}
```

</details>

<br />

---

### ✨ Particles

> An animated background component featuring dynamic particles with connection lines. Create interactive network visualizations with customizable particle count, colors, sizes, and connection settings. Perfect for modern, tech-focused designs.

💡 **Pro Tip:** Use the `advanced` prop to customize particle appearance, enable/disable connections, and even use custom images as particles for unique visual effects.

<br />

#### 📋 Props

| Prop              | Type                         | Default     | Description                       |
| ----------------- | ---------------------------- | ----------- | --------------------------------- |
| `width`           | `string \| number \| "auto"` | `"auto"`    | Width of the component            |
| `height`          | `string \| number \| "auto"` | `"auto"`    | Height of the component           |
| `backgroundColor` | `string`                     | `"#2c3e50"` | Background color                  |
| `speed`           | `number \| string`           | `2`         | Animation speed (higher = faster) |
| `advanced`        | `ParticlesAdvancedSettings`  | `undefined` | Advanced customization options    |
| `children`        | `React.ReactNode`            | -           | Content to display over animation |

<br />

<details>
<summary>📝 <b>ParticlesAdvancedSettings Interface</b></summary>

<br />

```typescript
interface ParticlesAdvancedSettings {
  count?: number | string; // Number of particles (default: 30)
  color?: string; // Particle color (hex format, default: "#e74c3c")
  size?: number | string; // Particle size in pixels (default: 5)
  opacity?: number | string; // Particle opacity 0-1 (default: 0.9)
  connectionDistance?: number | string; // Maximum distance for connections (default: 150)
  showConnections?: boolean; // Show connection lines between particles (default: true)
  connectionColor?: string; // Connection line color (hex format, default: "#3498db")
  connectionOpacity?: number | string; // Connection line opacity 0-1 (default: 0.8)
  image?: string; // Optional image URL to use as particle shape
  imageWidth?: number | string; // Image width in pixels (default: 20)
  imageHeight?: number | string; // Image height in pixels (default: 20)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { Particles } from "@innovista/ui";

function HeroSection() {
  return (
    <Particles backgroundColor="#2c3e50" speed={2}>
      <div className="hero-content">
        <h1>Particle Network</h1>
        <p>Dynamic connections and animations</p>
      </div>
    </Particles>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { Particles } from "@innovista/ui";

function AdvancedExample() {
  return (
    <Particles
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={2}
      advanced={{
        count: 50,
        color: "#6366f1",
        size: 6,
        opacity: 0.9,
        connectionDistance: 200,
        showConnections: true,
        connectionColor: "#8b5cf6",
        connectionOpacity: 0.6,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Custom Particle Network</h1>
        <p>Fine-tuned particle system</p>
      </div>
    </Particles>
  );
}
```

</details>

<details>
<summary><b>Without Connections</b></summary>

<br />

```tsx
import { Particles } from "@innovista/ui";

function NoConnectionsExample() {
  return (
    <Particles
      backgroundColor="#0a0a0a"
      speed={1.5}
      advanced={{
        count: 40,
        color: "#ff6b6b",
        size: 4,
        showConnections: false, // Disable connection lines
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Particles Only</h1>
        <p>No connection lines</p>
      </div>
    </Particles>
  );
}
```

</details>

<details>
<summary><b>With Custom Image Particles</b></summary>

<br />

```tsx
import { Particles } from "@innovista/ui";

function ImageParticlesExample() {
  return (
    <Particles
      backgroundColor="#000000"
      speed={2}
      advanced={{
        count: 30,
        image: "/path/to/particle-image.png",
        imageWidth: 25,
        imageHeight: 25,
        showConnections: true,
        connectionColor: "#ffffff",
        connectionOpacity: 0.3,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Custom Image Particles</h1>
        <p>Using images as particle shapes</p>
      </div>
    </Particles>
  );
}
```

</details>

<details>
<summary><b>Dense Network</b></summary>

<br />

```tsx
import { Particles } from "@innovista/ui";

function DenseNetworkExample() {
  return (
    <Particles
      width="100%"
      height="600px"
      backgroundColor="#1a1a2e"
      speed={2.5}
      advanced={{
        count: 80, // More particles
        color: "#4ecdc4",
        size: 3,
        connectionDistance: 120, // Shorter distance for denser network
        connectionColor: "#95e1d3",
        connectionOpacity: 0.5,
      }}
    >
      <div style={{ padding: "3rem", color: "white" }}>
        <h2>Dense Particle Network</h2>
        <p>Many particles with close connections</p>
      </div>
    </Particles>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { Particles } from "@innovista/ui";

export default function HomePage() {
  return (
    <Particles
      width="100%"
      height="100vh"
      backgroundColor="#2c3e50"
      speed={2}
      advanced={{
        count: 40,
        color: "#e74c3c",
        size: 5,
        opacity: 0.9,
        connectionDistance: 150,
        showConnections: true,
        connectionColor: "#3498db",
        connectionOpacity: 0.8,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful particle animations</p>
      </main>
    </Particles>
  );
}
```

</details>

<br />

---

### 🌧️ Rain

> An animated background component featuring realistic rain drops falling from top to bottom. Create atmospheric, weather-themed visual effects with customizable rain density, drop size, color, and speed.

💡 **Pro Tip:** Adjust the `count` and `rainHeight` in the `advanced` prop to control rain density and drop length. Use darker backgrounds with lighter rain colors for better visibility.

<br />

#### 📋 Props

| Prop              | Type                         | Default         | Description                       |
| ----------------- | ---------------------------- | --------------- | --------------------------------- |
| `width`           | `string \| number \| "auto"` | `"auto"`        | Width of the component            |
| `height`          | `string \| number \| "auto"` | `"auto"`        | Height of the component           |
| `backgroundColor` | `string`                     | `"transparent"` | Background color                  |
| `speed`           | `number \| string`           | `3`             | Animation speed (higher = faster) |
| `advanced`        | `RainAdvancedSettings`       | `undefined`     | Advanced customization options    |
| `children`        | `React.ReactNode`            | -               | Content to display over animation |

<br />

<details>
<summary>📝 <b>RainAdvancedSettings Interface</b></summary>

<br />

```typescript
interface RainAdvancedSettings {
  color?: string; // Rain drop color (hex format, default: "#3b82f6")
  rainHeight?: number | string; // Height/length of rain drops in pixels (default: 100)
  count?: number | string; // Number of rain drops (default: 30)
  width?: number | string; // Width of rain drops in pixels (default: 1)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { Rain } from "@innovista/ui";

function HeroSection() {
  return (
    <Rain backgroundColor="transparent" speed={3}>
      <div className="hero-content">
        <h1>Rainy Day</h1>
        <p>Atmospheric rain animation</p>
      </div>
    </Rain>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { Rain } from "@innovista/ui";

function AdvancedExample() {
  return (
    <Rain
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        color: "#60a5fa",
        rainHeight: 120,
        count: 50,
        width: 2,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Heavy Rain</h1>
        <p>Dense rain with custom settings</p>
      </div>
    </Rain>
  );
}
```

</details>

<details>
<summary><b>Light Rain</b></summary>

<br />

```tsx
import { Rain } from "@innovista/ui";

function LightRainExample() {
  return (
    <Rain
      backgroundColor="#0a0a0a"
      speed={2}
      advanced={{
        color: "#93c5fd",
        rainHeight: 80,
        count: 20, // Fewer drops
        width: 1,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Light Drizzle</h1>
        <p>Subtle rain effect</p>
      </div>
    </Rain>
  );
}
```

</details>

<details>
<summary><b>Heavy Storm</b></summary>

<br />

```tsx
import { Rain } from "@innovista/ui";

function HeavyStormExample() {
  return (
    <Rain
      backgroundColor="#000000"
      speed={5}
      advanced={{
        color: "#3b82f6",
        rainHeight: 150,
        count: 80, // Many drops
        width: 2,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Heavy Storm</h1>
        <p>Intense rain animation</p>
      </div>
    </Rain>
  );
}
```

</details>

<details>
<summary><b>Colorful Rain</b></summary>

<br />

```tsx
import { Rain } from "@innovista/ui";

function ColorfulRainExample() {
  return (
    <Rain
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        color: "#ec4899", // Pink rain
        rainHeight: 100,
        count: 40,
        width: 1.5,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Colorful Rain</h1>
        <p>Custom colored rain drops</p>
      </div>
    </Rain>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { Rain } from "@innovista/ui";

export default function HomePage() {
  return (
    <Rain
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        color: "#3b82f6",
        rainHeight: 100,
        count: 30,
        width: 1,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful rain animations</p>
      </main>
    </Rain>
  );
}
```

</details>

<br />

---

### ❄️ Snow

> An animated background component featuring realistic snowflakes falling with gentle swaying motion. Create winter-themed, atmospheric visual effects with customizable snowflake density, size, color, and sway speed.

💡 **Pro Tip:** Adjust the `count` and `size` in the `advanced` prop to control snow density and flake size. Use darker backgrounds with white snowflakes for better visibility, or experiment with colored snowflakes for unique effects.

<br />

#### 📋 Props

| Prop              | Type                         | Default         | Description                       |
| ----------------- | ---------------------------- | --------------- | --------------------------------- |
| `width`           | `string \| number \| "auto"` | `"auto"`        | Width of the component            |
| `height`          | `string \| number \| "auto"` | `"auto"`        | Height of the component           |
| `backgroundColor` | `string`                     | `"transparent"` | Background color                  |
| `backgroundImage` | `string`                     | `undefined`     | Optional background image URL     |
| `speed`           | `number \| string`           | `1`             | Animation speed (higher = faster) |
| `advanced`        | `SnowAdvancedSettings`       | `undefined`     | Advanced customization options    |
| `children`        | `React.ReactNode`            | -               | Content to display over animation |

<br />

<details>
<summary>📝 <b>SnowAdvancedSettings Interface</b></summary>

<br />

```typescript
interface SnowAdvancedSettings {
  color?: string; // Snowflake color (hex format, default: "#ffffff")
  size?: number | string; // Snowflake size in pixels (default: 3)
  count?: number | string; // Number of snowflakes (default: 100)
  swaySpeed?: number | string; // Horizontal sway speed (default: 0.5)
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function HeroSection() {
  return (
    <Snow backgroundColor="transparent" speed={1}>
      <div className="hero-content">
        <h1>Winter Wonderland</h1>
        <p>Beautiful snow animation</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function AdvancedExample() {
  return (
    <Snow
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={1}
      advanced={{
        color: "#ffffff",
        size: 4,
        count: 150,
        swaySpeed: 0.7,
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Heavy Snowfall</h1>
        <p>Dense snow with custom settings</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>Light Snow</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function LightSnowExample() {
  return (
    <Snow
      backgroundColor="#0a0a0a"
      speed={0.8}
      advanced={{
        color: "#e0e0e0",
        size: 2,
        count: 50, // Fewer snowflakes
        swaySpeed: 0.3,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Light Snowfall</h1>
        <p>Gentle winter scene</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>Blizzard Effect</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function BlizzardExample() {
  return (
    <Snow
      backgroundColor="#000000"
      speed={2}
      advanced={{
        color: "#ffffff",
        size: 5,
        count: 200, // Many snowflakes
        swaySpeed: 1.2,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Blizzard</h1>
        <p>Intense snowstorm animation</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>Colored Snowflakes</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function ColoredSnowExample() {
  return (
    <Snow
      backgroundColor="#1a1a2e"
      speed={1}
      advanced={{
        color: "#60a5fa", // Blue snowflakes
        size: 3,
        count: 100,
        swaySpeed: 0.5,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Colored Snow</h1>
        <p>Unique winter effect</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>With Background Image</b></summary>

<br />

```tsx
import { Snow } from "@innovista/ui";

function BackgroundImageExample() {
  return (
    <Snow
      backgroundColor="#1a1a2e"
      backgroundImage="/winter-landscape.jpg"
      speed={1}
      advanced={{
        color: "#ffffff",
        count: 80,
        size: 3,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Winter Scene</h1>
        <p>Snow over background image</p>
      </div>
    </Snow>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { Snow } from "@innovista/ui";

export default function HomePage() {
  return (
    <Snow
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={1}
      advanced={{
        color: "#ffffff",
        size: 3,
        count: 100,
        swaySpeed: 0.5,
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful snow animations</p>
      </main>
    </Snow>
  );
}
```

</details>

<br />

---

### 💧 WaterDrops

> An animated background component featuring realistic water drops with ripple effects. Create fluid, aquatic visual experiences with customizable drop colors, ripple effects, drop count, and animation speed.

💡 **Pro Tip:** Adjust the `maxDrops` and `rippleSize` in the `advanced` prop to control the density and impact of water drops. Use matching `dropColor` and `rippleColor` for cohesive effects, or contrast them for dynamic visuals.

<br />

#### 📋 Props

| Prop              | Type                         | Default         | Description                       |
| ----------------- | ---------------------------- | --------------- | --------------------------------- |
| `width`           | `string \| number \| "auto"` | `"auto"`        | Width of the component            |
| `height`          | `string \| number \| "auto"` | `"auto"`        | Height of the component           |
| `backgroundColor` | `string`                     | `"transparent"` | Background color                  |
| `backgroundImage` | `string`                     | `undefined`     | Optional background image URL     |
| `speed`           | `number \| string`           | `3`             | Animation speed (higher = faster) |
| `advanced`        | `WaterDropsAdvancedSettings` | `undefined`     | Advanced customization options    |
| `children`        | `React.ReactNode`            | -               | Content to display over animation |

<br />

<details>
<summary>📝 <b>WaterDropsAdvancedSettings Interface</b></summary>

<br />

```typescript
interface WaterDropsAdvancedSettings {
  dropColor?: string; // Water drop color (HSL or hex format, default: "hsl(180, 100%, 50%)")
  rippleColor?: string; // Ripple effect color (HSL or hex format, default: "hsl(180, 100%, 50%)")
  maxDrops?: number | string; // Maximum number of water drops (default: 30)
  dropSpeed?: number | string; // Drop falling speed (overrides speed prop if provided)
  rippleSize?: number | string; // Ripple size in pixels (default: 80)
  clearColor?: string; // Background clear color with alpha (default: "rgba(0, 0, 0, .1)")
}
```

</details>

<br />

#### 📚 Usage Examples

<details>
<summary><b>Basic Usage</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function HeroSection() {
  return (
    <WaterDrops backgroundColor="transparent" speed={3}>
      <div className="hero-content">
        <h1>Water Drops</h1>
        <p>Fluid ripple animations</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>Advanced Example with Custom Settings</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function AdvancedExample() {
  return (
    <WaterDrops
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        dropColor: "hsl(200, 100%, 60%)",
        rippleColor: "hsl(200, 100%, 60%)",
        maxDrops: 50,
        dropSpeed: 4,
        rippleSize: 100,
        clearColor: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
        <h1>Custom Water Drops</h1>
        <p>Fine-tuned aquatic effects</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>Subtle Effect</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function SubtleExample() {
  return (
    <WaterDrops
      backgroundColor="#0a0a0a"
      speed={2}
      advanced={{
        dropColor: "hsl(180, 50%, 40%)",
        rippleColor: "hsl(180, 50%, 40%)",
        maxDrops: 20, // Fewer drops
        rippleSize: 60, // Smaller ripples
        clearColor: "rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Subtle Water Effect</h1>
        <p>Gentle aquatic animation</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>Heavy Rain Effect</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function HeavyRainExample() {
  return (
    <WaterDrops
      backgroundColor="#000000"
      speed={5}
      advanced={{
        dropColor: "hsl(200, 100%, 70%)",
        rippleColor: "hsl(200, 100%, 70%)",
        maxDrops: 80, // Many drops
        dropSpeed: 6,
        rippleSize: 120, // Larger ripples
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Heavy Rain Effect</h1>
        <p>Intense water drop animation</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>Contrasting Colors</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function ContrastingColorsExample() {
  return (
    <WaterDrops
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        dropColor: "hsl(0, 100%, 60%)", // Red drops
        rippleColor: "hsl(180, 100%, 60%)", // Cyan ripples
        maxDrops: 40,
        rippleSize: 90,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Colorful Water Drops</h1>
        <p>Contrasting drop and ripple colors</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>With Background Image</b></summary>

<br />

```tsx
import { WaterDrops } from "@innovista/ui";

function BackgroundImageExample() {
  return (
    <WaterDrops
      backgroundColor="#1a1a2e"
      backgroundImage="/underwater-scene.jpg"
      speed={3}
      advanced={{
        dropColor: "hsl(180, 100%, 50%)",
        rippleColor: "hsl(180, 100%, 50%)",
        maxDrops: 30,
      }}
    >
      <div style={{ color: "white", padding: "2rem" }}>
        <h1>Underwater Scene</h1>
        <p>Water drops over background image</p>
      </div>
    </WaterDrops>
  );
}
```

</details>

<details>
<summary><b>Next.js Integration</b></summary>

<br />

```tsx
// app/page.tsx or pages/index.tsx
import { WaterDrops } from "@innovista/ui";

export default function HomePage() {
  return (
    <WaterDrops
      width="100%"
      height="100vh"
      backgroundColor="#1a1a2e"
      speed={3}
      advanced={{
        dropColor: "hsl(180, 100%, 50%)",
        rippleColor: "hsl(180, 100%, 50%)",
        maxDrops: 30,
        rippleSize: 80,
        clearColor: "rgba(0, 0, 0, .1)",
      }}
    >
      <main style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Next.js + Innovista UI</h1>
        <p>Beautiful water drop animations</p>
      </main>
    </WaterDrops>
  );
}
```

</details>

<br />

---

## ⚙️ Requirements

| Package       | Version                |
| ------------- | ---------------------- |
| **React**     | >= 17.0.0 or >= 18.0.0 |
| **React DOM** | >= 17.0.0 or >= 18.0.0 |

> ⚠️ **Note:** This package uses React as a peer dependency. Make sure React is installed in your project.

<br />

## 📄 License

This project is licensed under the **ISC License**.

<br />

## 👤 Author

**Abdulrahman Salameh**

- 📧 Email: [abdulrahman.salameh5@gmail.com](mailto:abdulrahman.salameh5@gmail.com)
- 🐙 GitHub: [@salamehDotDev](https://github.com/salamehDotDev/)

<br />

---

<div align="center">

### Made with ❤️ by the Innovista team

[![Star on GitHub](https://img.shields.io/github/stars/innovista/ui-react-nextjs?style=social)](https://github.com/innovista/ui-react-nextjs)

[Report Bug](https://github.com/salamehDotDev/InnoVista-UI) • [Request Feature](https://github.com/salamehDotDev/InnoVista-UI)

**If this project helps you, please consider giving it a ⭐!**

</div>
