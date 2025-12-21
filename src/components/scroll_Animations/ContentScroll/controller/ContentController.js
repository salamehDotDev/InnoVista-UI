import React from "react";

/**
 * Content Controller for Image Scroll Animation
 * Handles content processing, media handling, and section organization
 */
export default function ContentController() {
  const handlers = {
    //===============================================
    /**
     * Helper: Checks if a React element type is a heading or paragraph
     * @param {string} type - Element type to check
     * @returns {boolean} - True if element is text content
     */
    isTitleOrDescription: (type) => {
      return ["h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(type);
    },

    //===============================================
    /**
     * Helper: Checks if a React element type is an image or video
     * @param {string} type - Element type to check
     * @returns {boolean} - True if element is media
     */
    isMedia: (type) => {
      return ["img", "video"].includes(type);
    },

    //===============================================
    /**
     * Helper: Ensures media elements have the correct styling applied
     * @param {React.Element} element - Media element to style
     * @returns {React.Element} - Styled media element
     */
    ensureStyledMedia: (element) => {
      return handlers.ensureMediaStyling({ mediaElement: element });
    },

    //===============================================
    /**
     * Helper: Appends a child to an existing <div>, or creates a new <div> if none exists
     * @param {React.Element} existing - Existing div element
     * @param {React.Element} child - Child element to append
     * @returns {React.Element} - Updated div with child appended
     */
    appendToDiv: (existing, child) => {
      return existing ? React.cloneElement(existing, {}, React.Children.toArray(existing.props.children).concat(child)) : React.createElement("div", {}, child);
    },

    //===============================================
    /**
     * Ensures media elements have proper styling for the scroll animation.
     * @param {Object} params
     * @param {React.Element} params.mediaElement - Media element to style
     * @returns {React.Element} - Styled media element
     */
    ensureMediaStyling: ({ mediaElement }) => {
      if (!mediaElement) return mediaElement;

      const userStyle = mediaElement.props?.style || {};
      const { type } = mediaElement;
      const isVideo = type === "video";

      // For videos, ensure they fill the entire container
      const mediaStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center center",
        // For videos, add absolute positioning to fill container
        ...(isVideo
          ? {
              position: "absolute",
              top: 0,
              left: 0,
              minWidth: "100%",
              minHeight: "100%",
            }
          : {}),
        // Preserve any user-specified styles (but our styles take precedence)
        ...userStyle,
      };

      return React.cloneElement(mediaElement, { style: mediaStyle });
    },

    //===============================================
    /**
     * Processes the children of a section to separate text and media content.
     * @param {Array} sectionChildren - Array of React elements in the section
     * @returns {Object} { sectionInfo, mediaContent }
     */
    processSectionChildren: (sectionChildren) => {
      let sectionInfo = null; // Holds text content (headings, paragraphs, etc.)
      let mediaContent = null; // Holds media content (img, video)

      for (const sectionChild of sectionChildren) {
        if (!React.isValidElement(sectionChild)) continue;

        const { type, props } = sectionChild;

        // 1. If the element is a heading or paragraph, add to sectionInfo
        if (handlers.isTitleOrDescription(type)) {
          sectionInfo = handlers.appendToDiv(sectionInfo, sectionChild);
          continue;
        }

        // 2. If the element is a direct media (img or video), add to mediaContent
        if (handlers.isMedia(type)) {
          // For video, return directly without wrapping to ensure it fills the container
          if (type === "video") {
            mediaContent = handlers.ensureStyledMedia(sectionChild);
          } else {
            mediaContent = handlers.ensureStyledMedia(sectionChild);
          }
          continue;
        }

        // 3. If the element has children that are media, extract and style them
        const childArray = React.Children.toArray(props?.children);
        const hasDirectMedia = childArray.some((c) => React.isValidElement(c) && handlers.isMedia(c.type));

        if (hasDirectMedia) {
          const styledMedia = childArray.map((c) => (React.isValidElement(c) && handlers.isMedia(c.type) ? handlers.ensureStyledMedia(c) : c));
          mediaContent = React.createElement("div", {}, ...styledMedia);
          continue;
        }

        // 4. If the element has children that are text, add to sectionInfo
        const hasTextContent = childArray.some((c) => React.isValidElement(c) && handlers.isTitleOrDescription(c.type));
        if (hasTextContent) {
          sectionInfo = handlers.appendToDiv(sectionInfo, sectionChild);
          continue;
        }

        // 5. If the element is a custom styled div or fallback, add to sectionInfo
        if (props?.children) {
          sectionInfo = handlers.appendToDiv(sectionInfo, sectionChild);
        } else {
          sectionInfo = handlers.appendToDiv(sectionInfo, sectionChild);
        }
      }

      return { sectionInfo, mediaContent };
    },

    //===============================================
    /**
     * Processes the children of the ImageScrollAnimation component to extract
     * section info (text content) and media content for each section.
     * Returns an array of objects, each representing a section with its info and media.
     *
     * @param {Object} params
     * @param {React.ReactNode} params.children - The children passed to the component (sections)
     * @param {string} params.baseId - A unique base ID for generating section IDs
     * @returns {Array} Array of section objects: { key, id, className, style, sectionInfo, mediaContent }
     */
    processChildren: ({ children, baseId }) => {
      if (!children) return [];

      // Main: Process each child (section) and extract info/media for rendering
      return React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child, index) => {
          // Get all children of this section
          const sectionChildren = React.Children.toArray(child.props?.children || []);
          // Process to extract sectionInfo and mediaContent
          const { sectionInfo, mediaContent } = handlers.processSectionChildren(sectionChildren);

          // Return a section object with all relevant info for rendering
          return {
            key: child.key || `section-${index + 1}`,
            id: child.props?.id || `${baseId}-section-${index + 1}`,
            className: child.props?.className || "",
            style: child.props?.style || {},
            sectionInfo,
            mediaContent,
          };
        });
    },

    //===============================================
    /**
     * Validates and sanitizes section content.
     * @param {Object} params
     * @param {React.ReactNode} params.sectionInfo - Section text content
     * @param {React.ReactNode} params.mediaContent - Section media content
     * @returns {Object} - Validated content objects
     */
    validateSectionContent: ({ sectionInfo, mediaContent }) => {
      return {
        sectionInfo: sectionInfo || null,
        mediaContent: mediaContent || null,
      };
    },

    //===============================================
    /**
     * Extracts metadata from a section element.
     * @param {Object} params
     * @param {React.Element} params.section - Section element
     * @param {number} params.index - Section index
     * @param {string} params.baseId - Base ID for section
     * @returns {Object} - Section metadata
     */
    extractSectionMetadata: ({ section, index, baseId }) => {
      return {
        key: section.key || `section-${index + 1}`,
        id: section.props?.id || `${baseId}-section-${index + 1}`,
        className: section.props?.className || "",
        style: section.props?.style || {},
      };
    },
  };

  return handlers;
}
