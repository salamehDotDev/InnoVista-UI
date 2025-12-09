// Export all components from their respective folders
// This pattern makes it easy to add new components - just add a new export line

// CrystalBall Component
export { CrystalBall } from "./components/backgrounds/crystalBallAnimation";
export type { CrystalBallProps, StyleSettings } from "./components/backgrounds/crystalBallAnimation";

// AnimatedCircles Component
export { AnimatedCircles } from "./components/backgrounds/AnimatedCircles";
export type { AnimatedCirclesProps, AnimatedCirclesAdvancedSettings } from "./components/backgrounds/AnimatedCircles";

// ExpandingBalls Component
export { ExpandingBalls } from "./components/backgrounds/expandingBallsAnimation";
export type { ExpandingBallsProps, ExpandingBallsAdvancedSettings } from "./components/backgrounds/expandingBallsAnimation";

// ExpandingCircles Component
export { ExpandingCircles } from "./components/backgrounds/expandingCirclesAnimation";
export type { ExpandingCirclesProps, ExpandingCirclesAdvancedSettings } from "./components/backgrounds/expandingCirclesAnimation";

// Add new components here following the same pattern:
// export { ComponentName } from "./components/componentFolder";
// export type { ComponentNameProps } from "./components/componentFolder";