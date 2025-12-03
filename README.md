# @innovista/ui

<div align="center">

**A modern React UI component library built with TypeScript**

[![npm version](https://img.shields.io/npm/v/@innovista/ui.svg?style=flat-square)](https://www.npmjs.com/package/@innovista/ui)
[![npm downloads](https://img.shields.io/npm/dm/@innovista/ui.svg?style=flat-square)](https://www.npmjs.com/package/@innovista/ui)
[![License](https://img.shields.io/npm/l/@innovista/ui.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

Build beautiful, fast, and maintainable websites with our collection of carefully crafted React components.

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Components](#-components)
  - [CrystalBall](#crystalball)
- [TypeScript Support](#-typescript-support)
- [Requirements](#-requirements)
- [Examples](#-examples)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🎨 **Beautiful Components** - Carefully designed UI components
- ⚡️ **Performance Optimized** - Built with modern best practices
- 📦 **Tree-Shakeable** - Import only what you need
- 🔷 **TypeScript** - Full TypeScript support with type definitions
- 🎯 **Framework Compatible** - Works with React, Next.js, and more
- 🛠️ **Customizable** - Highly configurable components
- 📱 **Responsive** - Mobile-first responsive design

---

## 📦 Installation

Install the package using npm or yarn:

```bash
# Using npm
npm install @innovista/ui

# Using yarn
yarn add @innovista/ui

# Using pnpm
pnpm add @innovista/ui
```

> **Note for PowerShell users:** Use quotes when installing:
>
> ```powershell
> npm install "@innovista/ui"
> ```

---

## 🚀 Quick Start

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

---

## 🧩 Components

### CrystalBall

An animated crystal ball background component with customizable styles and smooth animations. Perfect for creating eye-catching hero sections and landing pages.

#### Basic Usage

```tsx
import { CrystalBall } from "@innovista/ui";

function HeroSection() {
  return (
    <CrystalBall
      width="100%"
      height="100vh"
      styleSettings={{
        backgroundColor: "#0a0a0a",
        circle1Color: "#f8f4ff",
        circle2Color: "#e6d9ff",
        circle3Color: "#d4b3ff",
        circle4Color: "#ff00ff",
        speed: 1,
        enableText: true,
        textContent: "Innovista",
        textColor: "#ffffff",
        textSize: 37,
      }}
    >
      <div className="hero-content">
        <h1>Welcome to Innovista</h1>
        <p>Building amazing experiences</p>
      </div>
    </CrystalBall>
  );
}
```

#### Props

| Prop            | Type                                 | Default      | Description                                                                                           |
| --------------- | ------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------- |
| `width`         | `string \| number \| "auto" \| null` | `"auto"`     | Width of the component. Accepts CSS values like `"100%"`, `"500px"`, or numbers (treated as pixels)   |
| `height`        | `string \| number \| "auto" \| null` | `"auto"`     | Height of the component. Accepts CSS values like `"100vh"`, `"500px"`, or numbers (treated as pixels) |
| `styleSettings` | `StyleSettings`                      | **Required** | Configuration object for animation and styling                                                        |
| `children`      | `React.ReactNode`                    | -            | Content to display over the animation                                                                 |

#### StyleSettings Interface

```tsx
interface StyleSettings {
  // Background
  backgroundColor: string | null; // Background color of the container
  backgroundImage: null | string; // Optional background image URL

  // Circle Colors
  circle1Color: string; // Color of the outermost circle
  circle2Color: string; // Color of the second circle
  circle3Color: string; // Color of the third circle
  circle4Color: string; // Color of the innermost circle

  // Animation
  speed: number | string; // Animation speed (higher = faster)

  // Text Configuration
  enableText: boolean; // Show/hide text in the center
  textContent: string; // Text to display
  textColor: string; // Text color
  textSize: string | number; // Text size (CSS value or number)
}
```

#### Advanced Example

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

#### Without Text

```tsx
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
    enableText: false, // Disable text
    textContent: "",
    textColor: "#ffffff",
    textSize: 37,
  }}
>
  {/* Your content */}
</CrystalBall>
```

---

## 📘 TypeScript Support

This package is written in TypeScript and includes comprehensive type definitions. Import types as needed:

```tsx
import { CrystalBall } from "@innovista/ui";
import type { CrystalBallProps, StyleSettings } from "@innovista/ui";

// Type-safe component usage
const settings: StyleSettings = {
  backgroundColor: "#000",
  circle1Color: "#f8f4ff",
  circle2Color: "#e6d9ff",
  circle3Color: "#d4b3ff",
  circle4Color: "#ff00ff",
  speed: 1,
  enableText: true,
  textContent: "TypeScript",
  textColor: "#ffffff",
  textSize: 37,
};
```

---

## ⚙️ Requirements

- **React** >= 17.0.0 or >= 18.0.0
- **React DOM** >= 17.0.0 or >= 18.0.0

This package uses React as a peer dependency, so make sure you have React installed in your project.

---

## 💡 Examples

### Next.js Example

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

### Custom Styling Example

```tsx
import { CrystalBall } from "@innovista/ui";

function CustomStyled() {
  return (
    <CrystalBall
      width="100%"
      height="500px"
      styleSettings={{
        backgroundColor: "transparent",
        backgroundImage: "url('/your-image.jpg')",
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

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Abdulrahman Salameh**

- Email: [abdulrahman.salameh5@gmail.com](mailto:abdulrahman.salameh5@gmail.com)
- GitHub: [@innovista](https://github.com/innovista)

---

<div align="center">

**Made with ❤️ by the Innovista team**

[Report Bug](https://github.com/innovista/ui-react-nextjs/issues) · [Request Feature](https://github.com/innovista/ui-react-nextjs/issues)

</div>
#   I n n o V i s t a - U I  
 