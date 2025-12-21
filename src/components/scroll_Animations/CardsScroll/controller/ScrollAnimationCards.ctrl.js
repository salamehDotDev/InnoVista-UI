// Import the separated controllers
import NavigationController from "./NavigationController.js";
import AnimationController from "./AnimationController.js";
import ScrollProgressController from "./ScrollProgressController.js";
import DeviceController from "./DeviceController.js";

export default function ScrollAnimationCardsCtrl() {
  // Initialize the separated controllers
  const navigationController = NavigationController();
  const animationController = AnimationController();
  const scrollProgressController = ScrollProgressController();
  const deviceController = DeviceController();

  const handlers = {
    // Navigation handlers
    handleSnapScroll: navigationController.handleSnapScroll,
    handleKeyDown: navigationController.handleKeyDown,
    handleKeyDownEvent: navigationController.handleKeyDownEvent,
    scrollToCard: navigationController.scrollToCard,
    // Animation handlers
    init3DScroll: animationController.init3DScroll,
    initScroll: animationController.initScroll,
    init3DScrollSnap: animationController.init3DScrollSnap,
    initScrollSnap: animationController.initScrollSnap,
    // Scroll progress handlers
    calculateScrollProgress: scrollProgressController.calculateScrollProgress,
    handleScroll: scrollProgressController.handleScroll,
    updateScroll: scrollProgressController.updateScroll,
    scrollHandler: scrollProgressController.scrollHandler,

    // Device handlers
    checkMobile: deviceController.checkMobile,
    //===============================================
  };
  return handlers;
}
