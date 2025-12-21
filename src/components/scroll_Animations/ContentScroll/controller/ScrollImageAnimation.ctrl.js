import React from "react";
// Import the separated controllers
import ThemeController from "./ThemeController.js";
import ContentController from "./ContentController.js";
import ScrollAnimationController from "./ScrollAnimationController.js";

export default function ScrollImageAnimationCtrl() {
  // Initialize the separated controllers
  const themeController = ThemeController();
  const contentController = ContentController();
  const scrollAnimationController = ScrollAnimationController();

  const handlers = {
    // Theme handlers
    buildThemeStyles: themeController.buildThemeStyles,
    ensureMediaStyling: themeController.ensureMediaStyling,
    // Content handlers
    isTitleOrDescription: contentController.isTitleOrDescription,
    isMedia: contentController.isMedia,
    ensureStyledMedia: contentController.ensureStyledMedia,
    appendToDiv: contentController.appendToDiv,
    processSectionChildren: contentController.processSectionChildren,
    processChildren: contentController.processChildren,
    // Scroll animation handlers
    handleScrollAnimation: scrollAnimationController.handleScrollAnimation,
    initScrollAnimations: scrollAnimationController.initScrollAnimations,
    //==================================================================================================
  };
  return handlers;
}
