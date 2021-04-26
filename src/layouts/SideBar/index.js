import React, { useState, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

const SideBar = () => {
  const [classifications, setClassifications] = useState([]);

  useEffect(() => {
    ipcRenderer.send("classifications:initialLoad");

    ipcRenderer.on("classifications:initialLoad", (event, classifications) => {
      console.log(classifications);
      setClassifications(classifications);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on("patientClassification:added", (event, classification) => {
      console.log("num", classifications.length);
      setClassifications([...classifications, classification]);
    });
  }, [classifications]);

  return (
    <div className="green side-bar">
      <div
        style={{ width: "100%", height: "100%", justifyContent: "flex-start", overflowY: "scroll" }}
        className="center-column"
      >
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <h1>Imported Melanoma Imaging Sets</h1>
        </div>

        {classifications.length > 0
          ? classifications.map((classification, index) => {
              return (
                <div key={index}>
                  <h2>{classification.patientName}</h2>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SideBar;
