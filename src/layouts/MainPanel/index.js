import React from "react";
import ImportDropDown from "components/ImportDropDown";

const MainPanel = () => {
  return (
    <div className="main-panel blue">
        <div style={{width: "100%", height: "100%"}} className="center-column">
          <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
            To begin detecting malignant Melanomas import a single patient’s
            information or a batch of patient information.
          </h1>

          <ImportDropDown />
        </div>
    </div>
  );
};

export default MainPanel;
