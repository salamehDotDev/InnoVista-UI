/**
 * Animation Controller for Scroll Animation Cards
 * Handles all GSAP animations and scroll trigger configurations
 */
export default function AnimationController() {
  const handlers = {
    //===============================================
    /**
     * Initializes 3D scroll animation for card transitions.
     * Each card animates from a "table" (rotateX: 90) to a "wall" (rotateX: 0) position as the user scrolls.
     * Cards scale and animate in a timeline controlled by ScrollTrigger.
     *
     * @param {Object} params
     * @param {Object} params.animate - GSAP animate instance
     * @param {boolean} params.isMobile - Whether the device is mobile (affects scale)
     * @returns {Function} - Function to initialize 3D scroll animation
     */
    init3DScroll:
      ({ animate, isMobile }) =>
      (section, items, lastCardZoomOut) => {
        // 1. Set initial positions for all cards - all cards start "on the table" (rotated 90°)
        items.forEach((item, index) => {
          // Each card starts rotated 90° (flat), scaled down, and centered
          animate.set(item, {
            rotateX: 90, // Flat on table
            scale: isMobile ? 0.3 : 0.7, // Smaller on mobile/tablet
            y: 0, // Centered vertically
            x: 0, // Centered horizontally
            opacity: 1, // Fully visible
            z: 0, // No Z offset
            transformOrigin: "center center", // Rotate around center
          });
        });

        // 2. Create a GSAP timeline with ScrollTrigger for scroll-driven animation
        const timeline = animate.timeline({
          scrollTrigger: {
            trigger: section, // The section to pin and animate
            pin: true, // Pin during animation
            start: "top top", // Start when section hits top of viewport
            end: () => `+=${items.length * 100}%`, // End after all cards have animated
            scrub: 1, // Smoothly link animation to scroll
            invalidateOnRefresh: true, // Recalculate on resize/refresh
            // Mobile-specific performance/configuration
            anticipatePin: 1, // Prevent jumps on mobile
            pinSpacing: true, // Maintain layout spacing
            fastScrollEnd: true, // Improve mobile performance
            normalizeScroll: true, // Normalize scroll on mobile
            ignoreMobileResize: false, // Allow mobile resize
          },
          defaults: { ease: "none" }, // Linear by default
        });

        // 3. Animate each card in sequence from table to wall, with optional zoom out and overlap
        items.forEach((item, index) => {
          // Calculate the normalized scroll progress for this card
          const startProgress = index / items.length;
          const endProgress = (index + 1) / items.length;
          const cardDuration = 1 / items.length; // Fraction of scroll for each card

          // a) Animate current card from table (rotateX: 90) to wall (rotateX: 0)
          timeline.to(
            item,
            {
              rotateX: 0, // Stand up to wall
              scale: 1, // Full size
              y: 0,
              x: 0,
              opacity: 1,
              z: 0,
              duration: cardDuration * 0.8, // Most of the card's scroll section
              ease: "power2.out",
            },
            startProgress // Start at this card's scroll position
          );

          // b) Hold the card on the wall for a brief moment
          timeline.to(
            item,
            {
              scale: 1,
              opacity: 1,
              y: 0,
              x: 0,
              duration: cardDuration * 0.1, // Short pause
            },
            startProgress + cardDuration * 0.8 // After stand-up animation
          );

          // c) Optionally scale down the card for a zoom-out effect (unless it's the last card and lastCardZoomOut is false)
          if (index < items.length - 1 || lastCardZoomOut) {
            timeline.to(
              item,
              {
                scale: 0.95, // Slight zoom out for depth
                borderRadius: "10px", // Add rounded corners
                y: 0,
                x: 0,
                duration: cardDuration * 0.1, // End of this card's scroll section
              },
              startProgress + cardDuration * 0.9
            );
          }

          // d) If not the last card, start animating the next card slightly before the current one ends (for overlap)
          if (index < items.length - 1) {
            timeline.to(
              items[index + 1],
              {
                rotateX: 0, // Next card stands up to wall
                scale: 1,
                y: 0,
                x: 0,
                opacity: 1,
                z: 0,
                duration: cardDuration * 0.8,
                ease: "power2.out",
              },
              startProgress + cardDuration * 0.9 // Overlap: next card starts before current finishes
            );
          }
        });
      },

    //===============================================
    /**
     * Initializes regular scroll animation for card transitions.
     * Cards slide in from off-screen positions based on direction (horizontal/vertical).
     *
     * @param {Object} params
     * @param {Object} params.animate - GSAP animate instance
     * @returns {Function} - Function to initialize scroll animation
     */
    initScroll:
      ({ animate }) =>
      (section, items, direction, lastCardZoomOut) => {
        // Determine the animation property based on direction
        const animationProperty = direction === "horizontal" ? "xPercent" : "yPercent";

        // Set initial positions for all cards except the first one
        // Cards are positioned off-screen (100% in the specified direction)
        items.forEach((item, index) => {
          if (index !== 0) {
            // Position cards off-screen using the same methodology for both directions
            animate.set(item, { [animationProperty]: 100 });
          }
        });

        // Create main timeline with scroll trigger configuration
        const timeline = animate.timeline({
          scrollTrigger: {
            trigger: section, // The section to pin and animate
            pin: true, // Pin the section during scroll animation
            start: "top top", // Start when section top hits viewport top
            end: () => `+=${items.length * 100}%`, // Dynamic end based on number of cards
            scrub: 1, // Smoothly link animation to scroll
            invalidateOnRefresh: true, // Recalculate on window resize
            // Mobile-specific fixes
            anticipatePin: 1, // Prevent jumps on mobile
            pinSpacing: true, // Maintain spacing while pinned
            fastScrollEnd: true, // Better performance on mobile
            normalizeScroll: true, // Normalize scroll on mobile
            ignoreMobileResize: false, // Allow mobile resize handling
          },
          defaults: { ease: "none" }, // Linear animation for scroll-driven effects
        });

        // Create animation sequence for each card using unified methodology
        items.forEach((item, index) => {
          // Add scaling and border radius animation for current card (same for both directions)
          // Only apply zoom out effect if it's not the last card OR if lastCardZoomOut is true
          if (index < items.length - 1 || lastCardZoomOut) {
            timeline.to(item, {
              scale: 0.9, // Slightly scale down for visual depth
              borderRadius: "10px", // Add rounded corners during animation
            });
          }

          // Animate the next card into view (if it exists) using unified methodology
          if (index < items.length - 1) {
            // Slide next card in using the same logic for both directions
            timeline.to(
              items[index + 1],
              {
                [animationProperty]: 0, // Move to original position
              },
              "<" // Start at the same time as previous animation
            );
          }
        });
      },

    //===============================================
    /**
     * Initializes 3D scroll snapping animation for cards.
     * Each card animates from a "table" (rotateX: 90) to a "wall" (rotateX: 0) position as the user scrolls,
     * with snapping behavior (either "mandatory" or "proximity").
     *
     * @param {Object} params
     * @param {Object} params.animate - GSAP animate instance
     * @param {boolean} params.isMobile - Whether the device is mobile (affects scale)
     * @returns {Function} - Function to initialize 3D scroll snapping animation
     */
    init3DScrollSnap:
      ({ animate, isMobile }) =>
      (section, items, snapType) => {
        // 1. Set initial positions for all cards
        //    - First card is upright ("on the wall")
        //    - All other cards are flat ("on the table")
        items?.forEach((item, index) => {
          if (index === 0) {
            // First card: upright, full size, centered
            animate.set(item, {
              rotateX: 0,
              scale: 1,
              y: 0,
              x: 0,
              opacity: 1,
              z: 0,
              transformOrigin: "center center",
            });
          } else {
            // Other cards: flat (rotated 90°), scaled down, centered
            animate.set(item, {
              rotateX: 90, // Flat on table
              scale: isMobile ? 0.3 : 0.7, // Smaller on mobile/tablet
              y: 0,
              x: 0,
              opacity: 1,
              z: 0,
              transformOrigin: "center center",
            });
          }
        });

        // 2. Create GSAP timeline with ScrollTrigger for snapping
        animate.timeline({
          scrollTrigger: {
            trigger: section, // The section to pin and animate
            pin: true, // Pin during animation
            start: "top top", // Start when section hits top of viewport
            end: () => `+=${items.length * 100}%`, // End after all cards have animated
            scrub: false, // No scrubbing, only snap
            invalidateOnRefresh: true, // Recalculate on resize/refresh

            // Mobile-specific performance/configuration
            anticipatePin: 1, // Prevent jumps on mobile
            pinSpacing: true, // Maintain layout spacing
            fastScrollEnd: true, // Improve mobile performance
            normalizeScroll: true, // Normalize scroll on mobile
            ignoreMobileResize: false, // Allow mobile resize

            // 3. Configure snapping behavior
            snap:
              snapType === "proximity"
                ? {
                    // Proximity snap: only snap if close enough to a snap point
                    snapTo: (value, self) => {
                      // Build array of snap points (one per card)
                      const snapPoints = [];
                      for (let i = 0; i <= items.length; i++) {
                        snapPoints.push(i / items.length);
                      }

                      // Find the closest snap point to current scroll value
                      const closest = snapPoints.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

                      // Only snap if within threshold (15% of card width)
                      const threshold = 0.15 / items.length;
                      const distance = Math.abs(closest - value);

                      return distance <= threshold ? closest : value;
                    },
                    duration: { min: 0.2, max: 0.3 }, // Snap animation duration
                    ease: "power2.out", // Easing for snap
                    inertia: false, // No inertia
                  }
                : {
                    // Mandatory snap: always snap to nearest card
                    snapTo: (value, self) => {
                      // Build array of snap points (one per card)
                      const snapPoints = [];
                      for (let i = 0; i <= items.length; i++) {
                        snapPoints.push(i / items.length);
                      }
                      // Use GSAP's snap utility to find nearest snap point
                      return animate.utils.snap(snapPoints, value);
                    },
                    duration: { min: 0.2, max: 0.3 }, // Snap animation duration
                    ease: "power2.out", // Easing for snap
                    inertia: false, // No inertia
                  },

            // 4. onUpdate: Animate cards based on current snap progress
            onUpdate: (self) => {
              // Calculate which card should be "active" (upright) based on scroll progress
              const progress = self.progress;
              const currentCardIndex = Math.floor(progress * items.length);

              items.forEach((item, index) => {
                if (index === currentCardIndex) {
                  // Current card: animate to upright position with smooth transition
                  animate.to(item, {
                    rotateX: 0,
                    scale: 1,
                    y: 0,
                    x: 0,
                    opacity: 1,
                    z: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                } else if (index < currentCardIndex) {
                  // Previous cards: instantly set to upright (already passed)
                  animate.set(item, {
                    rotateX: 0,
                    scale: 1,
                    y: 0,
                    x: 0,
                    opacity: 1,
                    z: 0,
                  });
                } else {
                  // Future cards: instantly set to flat (not yet reached)
                  animate.set(item, {
                    rotateX: 90,
                    scale: isMobile ? 0.3 : 0.7,
                    y: 0,
                    x: 0,
                    opacity: 1,
                    z: 0,
                  });
                }
              });
            },
          },
          defaults: { ease: "none" }, // Linear by default for timeline
        });
      },

    //===============================================
    /**
     * Initializes scroll snapping animation for cards.
     * @param {Object} animate - Animation library (e.g., GSAP).
     * @returns {Function} - Function to initialize scroll snapping on a section.
     */
    initScrollSnap:
      ({ animate }) =>
      (section, items, direction, snapType) => {
        // Determine the animation property based on direction (horizontal or vertical)
        const animationProperty = direction === "horizontal" ? "xPercent" : "yPercent";

        // Set initial position and scale for each card based on direction and index
        items.forEach((item, index) => {
          if (direction === "horizontal") {
            // Horizontal: cards are placed side by side
            if (index === 0) {
              // First card is centered
              animate.set(item, {
                xPercent: 0,
                scale: 1,
                borderRadius: "10px",
              });
            } else {
              // Other cards are placed to the right, slightly scaled down
              animate.set(item, {
                xPercent: 100 * index,
                scale: 0.9,
              });
            }
          } else {
            // Vertical: cards are stacked vertically
            if (index === 0) {
              // First card is centered
              animate.set(item, {
                [animationProperty]: 0,
                scale: 1,
                borderRadius: "10px",
              });
            } else {
              // Other cards are placed below, slightly scaled down
              animate.set(item, {
                [animationProperty]: 100,
                scale: 0.9,
              });
            }
          }
        });

        // Create a timeline with scrollTrigger for scroll snapping
        animate.timeline({
          scrollTrigger: {
            trigger: section, // The section element to pin and animate
            pin: true, // Pin the section during scroll
            start: "top top", // Start when section top hits viewport top
            end: () => `+=${items.length * 100}%`, // End after scrolling through all cards
            scrub: false, // No scrub for snapping
            invalidateOnRefresh: true, // Recalculate on resize/refresh

            // Mobile-specific options for smoother experience
            anticipatePin: 1, // Prevents jumps on mobile
            pinSpacing: true, // Keeps spacing while pinned
            fastScrollEnd: true, // Improves mobile performance
            normalizeScroll: true, // Normalizes scroll on mobile
            ignoreMobileResize: false, // Handles mobile resize

            // Snap configuration: proximity or mandatory
            snap:
              snapType === "proximity"
                ? {
                    /**
                     * Proximity snap: only snap if close enough to a snap point.
                     * @param {number} value - Current scroll progress (0-1).
                     * @param {Object} self - ScrollTrigger instance.
                     * @returns {number} - Snapped value or original value.
                     */
                    snapTo: (value, self) => {
                      // Build array of snap points (0, 1/N, 2/N, ..., 1)
                      const snapPoints = [];
                      for (let i = 0; i <= items.length; i++) {
                        snapPoints.push(i / items.length);
                      }

                      // Find the closest snap point to the current value
                      const closest = snapPoints.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

                      // Only snap if within a threshold (15% of card width)
                      const threshold = 0.15 / items.length;
                      const distance = Math.abs(closest - value);

                      return distance <= threshold ? closest : value;
                    },
                    duration: { min: 0.2, max: 0.3 }, // Snap animation duration
                    ease: "power2.out", // Easing for snap
                    inertia: false, // No inertia
                  }
                : {
                    /**
                     * Mandatory snap: always snap to the nearest snap point.
                     * @param {number} value - Current scroll progress (0-1).
                     * @param {Object} self - ScrollTrigger instance.
                     * @returns {number} - Snapped value.
                     */
                    snapTo: (value, self) => {
                      // Build array of snap points (0, 1/N, 2/N, ..., 1)
                      const snapPoints = [];
                      for (let i = 0; i <= items.length; i++) {
                        snapPoints.push(i / items.length);
                      }
                      // Use GSAP's snap utility to find the nearest snap point
                      return animate.utils.snap(snapPoints, value);
                    },
                    duration: { min: 0.2, max: 0.3 }, // Snap animation duration
                    ease: "power2.out", // Easing for snap
                    inertia: false, // No inertia
                  },

            /**
             * onUpdate: Called on scroll progress update.
             * Animates cards to their snapped positions.
             */
            onUpdate: (self) => {
              // Calculate current progress (0-1) and which card is active
              const progress = self.progress;
              const currentCardIndex = Math.floor(progress * items.length);

              items.forEach((item, index) => {
                if (index === currentCardIndex) {
                  // Animate the current card to its final position with smooth transition
                  animate.to(item, {
                    [animationProperty]: 0,
                    scale: 0.9,
                    borderRadius: "10px",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                } else if (index < currentCardIndex) {
                  // Previous cards: set to final position instantly
                  animate.set(item, {
                    [animationProperty]: 0,
                    scale: 0.9,
                    borderRadius: "10px",
                  });
                } else {
                  // Future cards: keep in initial (off-screen) position
                  animate.set(item, {
                    [animationProperty]: 100,
                  });
                }
              });
            },
          },
          defaults: { ease: "none" }, // Linear animation for scroll-driven effects
        });
      },
  };

  return handlers;
}
