import React from "react";

export default function JsxChildren({ classes, classesName, backgroundColor, children }) {
  return (
    <>
      {!children && (
        <div className={classes?.[classesName.scroll_section_container]} style={{ backgroundColor }}>
          <div className={classes?.[classesName.section]}>
            <div className={classes?.[classesName.container_medium]}>
              <div className={classes?.[classesName.padding_vertical]}>
                <div className={classes?.[classesName.max_width_large]}>
                  <h1 className={classes?.[classesName.heading]}>No cards provided</h1>
                  <p>Please provide children components to display the animation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
