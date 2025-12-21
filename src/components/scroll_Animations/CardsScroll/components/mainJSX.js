import React from "react";

export default function MainJSX({ baseId, children, classes, classesName, backgroundColor, sectionRef, wrapperRef, direction, enableScrollSnap, snapType }) {
  return (
    <div
      className={`${classes?.[classesName.scroll_section_container]} ${enableScrollSnap ? classes?.[classesName.scroll_snap_mode] : ""}`}
      style={{ backgroundColor }}
    >
      {/* Main scroll animation section with pinning and trigger detection */}
      <div
        ref={sectionRef}
        className={`${classes?.[classesName.scroll_section]} ${direction === "3d" ? classes?.[classesName.three_d] : direction}-section ${
          classes?.[classesName.section]
        }`}
        style={{
          perspective: direction === "3d" ? "1000px" : "none",
          transformStyle: direction === "3d" ? "preserve-3d" : "flat",
          scrollSnapType: enableScrollSnap ? `y ${snapType}` : "none", // Add CSS scroll snap when enabled
        }}
      >
        <div
          ref={wrapperRef}
          className={classes?.[classesName.wrapper]}
          style={{
            transform: "none",
            transformOrigin: "center center",
            transition: "none",
      
          }}
        >
          {/* Semantic list structure for accessibility */}
          <div role="list" className={classes?.[classesName.list]}>
            {React.Children.map(children, (child, index) => {
              // Generate unique IDs for accessibility and debugging
              const cardId = `${baseId}-card-${index}`;
              const contentId = `${baseId}-content-${index}`;

              // Extract styling from child props if available
              const childStyle = child?.props?.style || {};
              const childBackgroundColor = child?.props?.backgroundColor || child?.props?.bg || "#ffffff";

              // Combine child styles with default card styling
              const cardStyle = {
                backgroundColor: childBackgroundColor,
                ...childStyle,
              };

              return (
                <div
                  key={cardId}
                  id={cardId}
                  role="listitem"
                  className={classes?.[classesName.item]}
                  aria-label={`Card ${index + 1} of ${React.Children.count(children)}`}
                  style={{
                    scrollSnapAlign:  "none", // Add CSS scroll snap alignment when enabled

                  }}
                >
                  {/* Card content container with applied styling */}
                  <div id={contentId} className={classes?.[classesName.item_content]} style={cardStyle} aria-describedby={`${cardId}-description`}>
                    {child}
                  </div>
                  {/* Hidden description for screen readers - improves accessibility */}
                  <div id={`${cardId}-description`} className={classes?.[classesName.sr_only]} aria-hidden="true">
                    Scroll animation card {index + 1} with {direction} direction
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
