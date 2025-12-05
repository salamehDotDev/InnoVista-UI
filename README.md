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

<summary>💡 Note for PowerShell users</summary>

<br />

Use quotes when installing scoped packages:

```powershell
npm install "@innovista/ui"
```



<br />

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

🎉 **That's it!** You're ready to build amazing UIs.

<br />

## 🧩 Components

### CrystalBall

> An animated crystal ball background component with customizable styles and smooth animations. Perfect for creating eye-catching hero sections and landing pages.

💡 **Pro Tip:** When you provide `children`, text rendering is automatically disabled to avoid conflicts.

<br />

#### 📋 Props

| Prop            | Type                                 | Default      | Description                         |
| --------------- | ------------------------------------ | ------------ | ----------------------------------- |
| `width`         | `string \| number \| "auto" \| null` | `"auto"`     | Width of the component              |
| `height`        | `string \| number \| "auto" \| null` | `"auto"`     | Height of the component             |
| `styleSettings` | `StyleSettings`                      | **Required** | Animation and styling configuration |
| `children`      | `React.ReactNode`                    | -            | Content to display over animation   |

<br />

<details>
<summary>📝 <b>StyleSettings Interface</b></summary>

<br />

```typescript
interface StyleSettings {
  // Background Configuration
  backgroundColor: string | null; // Background color
  backgroundImage: string | null; // Optional background image URL

  // Circle Colors (from outer to inner)
  circle1Color: string; // Outermost circle color
  circle2Color: string; // Second circle color
  circle3Color: string; // Third circle color
  circle4Color: string; // Innermost circle color

  // Animation Settings
  speed: number | string; // Animation speed (higher = faster)

  // Text Configuration
  enableText: boolean; // Show/hide center text
  textContent: string; // Text to display
  textColor: string; // Text color
  textSize: string | number; // Text size
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

</details>

<br />

## ⚙️ Requirements

| Package       | Version                |
| ------------- | ---------------------- |
| **React**     | >= 17.0.0 or >= 18.0.0 |
| **React DOM** | >= 17.0.0 or >= 18.0.0 |

> ⚠️ **Note:** This package uses React as a peer dependency. Make sure React is installed in your project.

<br />

## 🤝 Contributing

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
