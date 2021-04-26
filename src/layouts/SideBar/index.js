import React, { useState, useEffect } from "react";

const SideBar = ({ classifications, setSelectedTabData }) => {
  return (
    <div className="green side-bar">
      {/* overflowY makes scrollbar visible if there are too many items in sidebar causing overflow */}
      <div
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
          overflowY: "auto",
        }}
        className="center-column"
      >
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <h1>Imported Melanoma Imaging Sets</h1>
        </div>

        {classifications.length > 0
          ? classifications.map((classification, index) => {
              return (
                <div key={index}>
                  <h2 onClick={() => setSelectedTabData(classifications[index])}>{classification.patientName}</h2>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SideBar;
