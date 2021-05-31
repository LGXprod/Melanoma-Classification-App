import React, { useState, useEffect } from "react";

const SideBar = ({ classifications, setSelectedTab }) => {
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
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <h1>Imported Melanoma Imaging</h1>
        </div>

        <h2
          style={{ cursor: "pointer" }}
          onClick={() =>
            setSelectedTab({
              type: "About Page",
              data: null,
            })
          }
        >
          About
          <br />
          Melanmore
        </h2>

        {classifications.length > 0 ? (
          <hr
            style={{
              width: "100%",
              height: "2px",
              border: "0",
              padding: "0",
              borderTop: "2px solid #64669b",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
        ) : null}

        {classifications.length > 0
          ? classifications.map((classification, index) => {
              return (
                <div key={index}>
                  <h3
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setSelectedTab({
                        type: classification.isBatch
                          ? "Batch Classification"
                          : "Single Classification",
                        data: classification,
                      })
                    }
                  >
                    {classification.name}
                  </h3>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SideBar;
