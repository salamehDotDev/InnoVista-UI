import { animate } from "./core.js";
import { CSSPlugin } from "./CSSPlugin.js";

const aniWithCSS = animate.registerPlugin(CSSPlugin) || animate, // to protect from tree shaking
  TweenMaxWithCSS = aniWithCSS.core.Tween;

export { aniWithCSS as animate, aniWithCSS as default };
