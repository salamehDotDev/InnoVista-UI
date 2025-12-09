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
