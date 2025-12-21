import React from "react";

export default function JsxSnapDirectionType({
  direction,
  classes,
  classesName,
  backgroundColor,
  children,
  containerRef,
  snapType,
  enableScrollIndicator,
  totalCards,
  currentCard,
  scrollToCard,
  baseId,
}) {
  return (
    <>
      {direction === "snap" && (
        <div className={classes?.[classesName.scroll_snapping_container]} style={{ backgroundColor }}>
          {/* Main scroll snapping content */}
          <div
            ref={containerRef}
            className={classes?.[classesName.scroll_snapping_content]}
            style={{
              scrollSnapType: `y ${snapType}`,
            }}
            role="main"
            aria-label="Scroll snapping cards"
          >
            {/* Render each child as a section */}
            {React.Children.map(children, (child, index) => {
              const sectionId = `${baseId}-section-${index}`;
              const isActive = index === currentCard;

              // Extract styling from child props if available
              const childStyle = child?.props?.style || {};
              const childBackgroundColor = child?.props?.backgroundColor || child?.props?.bg || "#ffffff";

              // Combine child styles with default section styling
              const sectionStyle = {
                backgroundColor: childBackgroundColor,
                scrollSnapAlign: "start", // Required for CSS scroll snapping to work properly
                ...childStyle,
              };

              return (
                <div
                  key={sectionId}
                  id={sectionId}
                  className={classes?.[classesName.section]}
                  role="region"
                  aria-label={`Section ${index + 1} of ${totalCards}`}
                  aria-current={isActive ? "true" : "false"}
                  style={sectionStyle}
                >
                  <div className={classes?.[classesName.section_content]}>{child}</div>
                </div>
              );
            })}
          </div>

          {/* Scroll progress indicator */}
          {enableScrollIndicator && totalCards > 1 && (
            <div className={classes?.[classesName.scroll_indicator]} role="navigation" aria-label="Section navigation">
              <div className={classes?.[classesName.scroll_indicator_dots]}>
                {Array.from({ length: totalCards }, (_, index) => (
                  <button
                    key={`${baseId}-indicator-${index}`}
                    className={`${classes?.[classesName.scroll_indicator_dot]} ${index === currentCard ? classes?.[classesName.active] : ""}`}
                    onClick={() => scrollToCard(index)}
                    aria-label={`Go to section ${index + 1}`}
                    aria-current={index === currentCard ? "true" : "false"}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
